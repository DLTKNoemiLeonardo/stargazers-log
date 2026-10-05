const repositoryList = document.querySelector('#repository-list');
const repositoryCount = document.querySelector('#repository-count');

function formatStars(stars) {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(stars);
}

function createRepositoryItem(repository) {
  const item = document.createElement('li');
  item.className = 'repository-item';

  const link = document.createElement('a');
  link.className = 'repository-link';
  link.href = repository.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = repository.name;

  const owner = document.createElement('span');
  owner.className = 'repository-owner';
  owner.textContent = ` / ${repository.owner}`;
  link.append(owner);

  const description = document.createElement('p');
  description.className = 'repository-description';
  description.textContent = repository.description;

  const meta = document.createElement('div');
  meta.className = 'repository-meta';

  const language = document.createElement('span');
  language.className = 'repository-language';
  language.textContent = repository.language;

  const stars = document.createElement('span');
  stars.textContent = `${formatStars(repository.stars)} stars`;

  const date = document.createElement('time');
  date.dateTime = repository.starred_at;
  date.textContent = `Starred ${new Date(`${repository.starred_at}T00:00:00`).toLocaleDateString('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })}`;

  meta.append(language, stars, date);
  item.append(link, description, meta);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch('./events.json');
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const repositories = await response.json();
    repositoryList.replaceChildren(...repositories.map(createRepositoryItem));
    repositoryCount.textContent = `${repositories.length} repositories`;
  } catch (error) {
    repositoryList.replaceChildren();
    const message = document.createElement('li');
    message.className = 'list-message';
    message.textContent = 'Could not load repositories. Open this page through a local web server and try again.';
    repositoryList.append(message);
    repositoryCount.textContent = 'Unavailable';
    console.error('Unable to load starred repositories:', error);
  }
}

loadRepositories();