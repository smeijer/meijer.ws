import FilterButton from '~/components/filter-button';

function FilterButtons() {
  return (
    <div className="w-full grid grid-cols-4">
      <FilterButton slug="projects" img="logos/apps.svg">
        <span aria-hidden className="sm:hidden">
          apps
        </span>
        <span className="hidden sm:inline">projects</span>
      </FilterButton>
      <FilterButton slug="articles" img="/logos/article.svg">
        <span aria-hidden className="sm:hidden">
          blog
        </span>
        <span className="hidden sm:inline">articles</span>
      </FilterButton>
      <FilterButton slug="releases" img="/logos/release.svg">
        <span aria-hidden className="sm:hidden">
          libs
        </span>
        <span className="hidden sm:inline">libraries</span>
      </FilterButton>
      <FilterButton slug="open-source" img="/logos/github.svg">
        <span aria-hidden className="sm:hidden">
          repos
        </span>
        <span className="hidden sm:inline">repositories</span>
      </FilterButton>
    </div>
  );
}

export default FilterButtons;
