import fs from 'fs/promises';
import dotenv from 'dotenv';
import glob from "fast-glob";
import path from "path";
import {  setTimeout } from 'timers/promises';
import { digestMessage } from "./api/crypto";
import { extractMatter } from "./api/markdown";

const BASE_URL = 'https://meijer.ws';

const { parsed: env } = dotenv.config({ path: '.env.local' });

function getOg(slug: string) {
  return `https://meijer.ws/api/og?path=/articles/${slug}`;
}

export const GITHUB_GRAPHQL_API_URL = 'https://api.github.com/graphql';

export interface GCreateDiscussionInput {
  repositoryId: string;
  categoryId: string;
  title: string;
  body: string;
}

export interface CreateDiscussionResponse {
  data: {
    createDiscussion: {
      discussion: {
        id: string;
      };
    };
  };
}

export interface UpdateDiscussionResponse {
  data: {
    updateDiscussion: {
      discussion: {
        id: string;
      };
    };
  };
}

export async function createDiscussion(
  input: GCreateDiscussionInput,
) {
  const response = await fetch(GITHUB_GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation($input: CreateDiscussionInput!) {
          createDiscussion(input: $input) {
            discussion {
              id
            }
          }
        }
      `,
      variables: { input },
    }),
  }).then((r) => r.json()) as CreateDiscussionResponse;

  return response?.data?.createDiscussion?.discussion?.id;
}

export async function updateDiscussion(
  input: { discussionId: string; body: string },
) {
  const response = await fetch(GITHUB_GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation ($input: UpdateDiscussionInput!) {
          updateDiscussion(input: $input) {
            discussion {
              id
            }
          }
        }
      `,
      variables: { input }
    })
  }).then((r) => r.json()) as UpdateDiscussionResponse;

  return response?.data?.updateDiscussion?.discussion?.id;
}

type GetDiscussionResponse = {
  data: {
    repository: {
      discussions: {
        pageInfo: {
          hasNextPage: boolean,
          endCursor: string;
        },
        nodes: {
          id: string;
          title: string;
          body: string;
        }[]
      }
    }
  }
}

export async function getDiscussions(input: { categoryId: string }) {
  const [owner, repo] = env.NEXT_PUBLIC_GISCUS_REPO.toLowerCase().split('/');

  let cursor = '';
  const discussions: GetDiscussionResponse['data']['repository']['discussions']['nodes']  = [];

  while (true) {
    const response = await fetch(GITHUB_GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ($owner: String!, $repo: String!, $cursor: String, $categoryId: ID!) {
            repository(owner: $owner, name: $repo) {
              discussions(categoryId: $categoryId, after: $cursor, first: 100) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  id
                  title
                  body
                }
              }
            }
          }
        `,
        variables: {
          owner,
          repo,
          categoryId: input.categoryId,
          cursor,
        }
      }),
    }).then(x => x.json()) as GetDiscussionResponse;

    const data = response.data?.repository?.discussions;
    discussions.push(...data?.nodes);

    if (!data?.pageInfo?.hasNextPage) break;
    cursor = data?.pageInfo.endCursor;
  }

  return discussions;
}

async function main() {
  const root = 'src/pages/articles';
  const articleFilenames = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), root),
  });

  const articles = [];
  for await (let filename of articleFilenames) {
    articles.push({
      filename,
      slug: 'articles/' + path.basename(filename.replace('/index', ''), '.mdx'),
      markdown: await fs.readFile(path.join(process.cwd(), root, filename), 'utf-8'),
    });
  }

  const discussions = await getDiscussions({
    categoryId: env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  });

  const githubDiscussions = new Map(discussions.map(x => [x.title, x]));
  let didPublish = false;

  for (let article of articles) {
    const canonicalUrl = `${BASE_URL}/${article.slug}`;

    const { matter } = extractMatter(article.markdown);
    if (matter.published !== 'true') {
      continue;
    }

    const discussion = githubDiscussions.get(article.slug);
    const hashTag = `<!-- sha1: ${await digestMessage(article.title)} -->`;
    const body = `${matter.description}\n\n${canonicalUrl}\n\n${hashTag}`;

    if (discussion && discussion.body.trim() === body.trim()) continue;

    // anti rate limitting
    if (didPublish) await setTimeout(100);
    didPublish = true;

    if (discussion) {
      console.log(`[github] update: ${canonicalUrl}`);
      await updateDiscussion({ discussionId: discussion.id, body });
      continue;
    }

    console.log(`[github] publish: ${canonicalUrl}`);
    await createDiscussion({
      repositoryId: env.NEXT_PUBLIC_GISCUS_REPO_ID,
      categoryId: env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      title: article.slug,
      body,
    });
  }
}

main()
