import { GithubUser } from "./GithubUser.js"

export class Gitfavorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@git-fav:')) || []

    console.log(this.entries)
   
  }

  save() {
    localStorage.setItem('@git-fav:', JSON.stringify(this.entries))
  }



  async add(username) {
   try {

    const userExists = this.entries.find(entry => entry.login === username)

    if(userExists) {
      throw new Error(`Usuário ${username} já existe!`)
     }

    const user = await GithubUser.searchUser(username)
    
    if(user === undefined) { 
      throw new Error(`Usuário ${username} não encontrado!`)
    }

    this.entries = [user, ...this.entries]

    this.update()
    this.save()

   } catch (error) {
      alert(error.message)
  }

}

delete(user) {
  const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

  this.entries = filteredEntries
  this.update()
  this.save()
}

}

export class GitfavoritesView extends Gitfavorites {
  constructor(root) {
    super(root)

    this.tbody = document.querySelector('table tbody')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = document.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.add(value)
    }
  }

  update() {
   
    this.removeAll()

    this.entries.forEach(user => {
      const row = this.createRow()
       
      row.querySelector('.user img').src = `https://github.com/${user.login}.png` 
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {this.delete(user)}
        
      

      this.tbody.append(row)
    })

    
  }

  removeAll() {
    this.tbody.querySelectorAll('tr')
    .forEach((tr) => {
      tr.remove()
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
        <td>
        <div class="user">
          <img src="https://Github.com/ElisbertoJunior.png" alt="Imagem de Elisberto Junior">
          <a href="https://Github.com/ElisbertoJunior" target="_blank">
            <p>Elisberto Junior</p>
            <span>/ElisbertoJunior</span>
          </a>
        </div>
        </td>
        <td class="repositories">
            25
        </td>
        <td class="followers">
            5
        </td>
        <td>
            <button class="remove">Remover</button>
         </td>
    `
    
    return tr
  }

 
}

