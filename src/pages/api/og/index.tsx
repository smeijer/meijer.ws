/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { profile } from '@/../data/profile';
import { NextRequest } from "next/server";
import { getPublicURL } from "@/lib/url";

export const config = {
  runtime: 'edge',
};

const avatar = fetch(new URL('./smeijer.jpg', import.meta.url)).then((res) =>
  res.arrayBuffer(),
);

const pages = fetch(getPublicURL('/og/pages.json')).then(x => x.json());

const  OgImageHandler = async (req: NextRequest) => {
  // convertkit messes the url up like:                  ⌄⌄⌄
  //    /api/og?path=%2Farticles%2Fisomorphic-development%3Fck_subscriber_id%3D2020065464
  const search = new URL(req.url).search.replaceAll('%3F', '&');
  const searchParams = new URLSearchParams(search);
  const [pageData, imageData] = await Promise.all([pages, avatar]);

  const path = searchParams.get('path');
  const page = pageData[path];

  if (!page) {
    return new Response('Not Found', { status: 404 });
  }

  const image = {
    ...page.image,
    words: page.image?.words || page.title,
  }

  return new ImageResponse(
    (
      <div tw="w-full h-full bg-zinc-900 flex items-stretch justify-between" style={{ fontFamily: 'ui-sans-serif' }}>
        <div tw="flex flex-col w-3/5 h-full p-12 justify-between">
          <h1 tw="font-bold tracking-normal text-zinc-100 text-5xl px-6 leading-tight">
            {image.words}
          </h1>

          {image.author !== false && <div tw="flex">
            {/*// @ts-ignore*/}
            <img alt="" width="128" height="128" src={imageData} tw="rounded-full" />

            <div tw="pl-4 flex flex-col justify-center text-zinc-400">
              <div tw="text-4xl font-bold tracking-tight">{profile.author.name}</div>
              <div tw="text-xl font-bold">{getPublicURL(page.url, false)}</div>
            </div>
          </div>}
        </div>

        <div tw="flex h-full w-2/5 py-12 pr-12">
          <div tw="flex w-full h-full rounded-2xl overflow-hidden">
            {image.image && <img alt="" tw="w-full h-full" style={{ objectFit: 'cover' }} src={getPublicURL(image.image)} />}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}

// https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation/og-image-examples#using-a-custom-font
export default OgImageHandler;
