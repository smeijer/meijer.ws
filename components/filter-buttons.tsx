import FilterButton from '~/components/filter-button';

function FilterButtons() {
  return (
    <div className="w-full grid grid-cols-3">
      <FilterButton slug="projects" img="/logos/apps.svg">
        projects
      </FilterButton>
      <FilterButton slug="articles" img="/logos/article.svg">
        articles
      </FilterButton>
      <FilterButton slug="open-source" img="/logos/github.svg">
        open source
      </FilterButton>
    </div>
  );
}

export default FilterButtons;
