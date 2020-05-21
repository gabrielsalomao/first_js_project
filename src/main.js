import api from './api';

class App {
    constructor() {
        this.repositories = [];
        this.formEl = document.getElementById('repo-form');
        this.inputEl = document.querySelector('input[name=repository]');
        this.listEl = document.getElementById('repo-list');

        this.registerHandlers();
    }

    registerHandlers() {
        this.formEl.onsubmit = event => this.addRepository(event);
    }

    deleteRepo(id) {
        var pos = frutas.find(x => x.id === id);
        console.log(pos)
    }

    setLoading(loading = true) {
        if (loading == true) {
            let loadingElement = document.createElement('span');
            loadingElement.appendChild(document.createTextNode('Carregando...'));
            loadingElement.setAttribute('id', 'loading');

            this.formEl.appendChild(loadingElement);
        } else {
            document.getElementById('loading').remove();
        }
    }

    async addRepository(event) {
        event.preventDefault();

        const repoInput = this.inputEl.value;

        if (repoInput.lenght === 0) {
            return;
        }

        this.setLoading();

        try {

            const response = await api.get(`/repos/${repoInput}`);

            console.log(response);

            const { id, name, description, html_url, owner: { avatar_url } } = response.data;

            this.repositories.push({
                id,
                name,
                description,
                avatar_url,
                html_url,
            });

            this.inputEl.value = '';
            this.render();

        } catch (err) {
            alert('Repo nao existe')
        }
        this.setLoading(false);
    }

    render() {
        this.listEl.innerHTML = '';

        this.repositories.forEach(repo => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', repo.avatar_url);

            let titleEl = document.createElement('strong');
            let repoName = document.createTextNode(repo.name);
            titleEl.appendChild(repoName);

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));

            let linkEl = document.createElement('a');
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);
            linkEl.appendChild(document.createTextNode('Acessar'));

            let delEl = document.createElement('a');
            delEl.setAttribute('href', '#');
            delEl.setAttribute('onclick', `deleteRepo(${repo.id})`);
            delEl.appendChild(document.createTextNode('Excluir'));
            delEl.style.marginLeft = '1rem';

            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titleEl);
            listItemEl.appendChild(descriptionEl);
            listItemEl.appendChild(linkEl);
            listItemEl.appendChild(delEl);

            this.listEl.appendChild(listItemEl);
        });
    }
}

new App();