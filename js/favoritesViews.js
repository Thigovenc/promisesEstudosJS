import { GithubUser } from "./GIthubUser.js"


export class Favorites{
    constructor(root){
        this.root= document.querySelector(root)
        this.load()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites')) || []
        console.log(this.entries)
    }
    save(){
        localStorage.setItem('@github-favorites', JSON.stringify(this.entries))
    }

    async add(username){
        try{

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists){
                throw new Error("Usuario ja cadastrado");
                
            }

            const user = await GithubUser.search(username)
            console.log(user)

            if(user.login === undefined){
                throw new Error('Usuario nao encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update();
        }catch(error){
            alert(error.message)
        }
    }

    delete(user){
        const filteredEntries = this.entries.filter((entry)=> entry.login !== user.login)
        
        this.entries = filteredEntries;
        this.update();
        this.save();
    }
}

export class FavoritesView extends Favorites {
    
    constructor(root){
        super(root)
        this.tbody = document.querySelector('table tbody')

        this.update();

        this.onAdd();
    }
    onAdd(){
        const addButton= this.root.querySelector('.search button')
        addButton.onclick= () => {
            const  { value } = this.root.querySelector('.search input')
            this.add(value);
        }
        
    }

    update(){
        this.removerAllTr();


        this.entries.forEach(user => {
            const row = this.createRow();
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.name
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers
            
            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('tem certeza que deseja deletar essa linha ?')
                if(isOk){
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })

    }

    createRow(){
        const tr = document.createElement('tr')

        const content = `
                    <td class="user">
                        <img src="https://github.com/Thigovenc.png" alt="Imagem de Thiago Venceslau">
                        <a href="https://github.com/Thigovenc">
                            <p>Thiago Venceslau</p>
                            <span>Thigovenc</span>
                        </a>
                    </td>
                    <td class="repositories">76</td>
                    <td class="followers">9589</td>
                    <td>
                        <button class="remove">&times;</button>
                    </td>
        `
        tr.innerHTML = content;

        return tr;
    }
    removerAllTr(){
        
        this.tbody.querySelectorAll('tr').forEach((tr)=>{
            tr.remove() 
        })
    }
}