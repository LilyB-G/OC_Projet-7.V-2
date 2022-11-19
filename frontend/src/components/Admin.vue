<template>
  <!-- <div id="app"> -->
    <v-app id="inspire">
     
      <v-main>

          

        <v-container fluid fill-height>
          <v-flex xs12 sm6 offset-sm3>
            
                  <v-row class="mt-3">
                <v-spacer></v-spacer>  <v-btn v-show="isAdmin === 'true'" color="primary"  to="/"> Mur </v-btn> <v-spacer></v-spacer>
                    <v-btn @click="logout" color="red" class="spacing white--text" right :loading="loading">Déconnexion</v-btn>   <v-spacer></v-spacer>  
                  </v-row>

              <!-- <v-btn to="/feed"> Feed </v-btn>  -->
               <h4 class="my-4 text-center"> Liste des utilisateurs </h4>
            <v-simple-table class="spacing">
                <thead>
                    <tr>
                    <th class="text-left">
                        User
                    </th>
                    <th class="text-left">
                        ID
                    </th>
                    <th class="text-left">
                        Email
                    </th>
                    <th class="text-left">
                        Supprimer
                    </th>
                    </tr>
                </thead>
                <tbody > 
                    <tr
                    v-for="user in users" 
                    :key="user.id"
                    >
                    <td>{{ user.username }}</td>
                    <td>{{ user.id }}</td>
                    <td>{{ user.email }}</td>
                    <td> <v-btn v-show="user.id != 1" @click="deleteUser(user.id)"><v-icon dense color="red"> mdi-delete </v-icon></v-btn></td>
                    </tr>
                </tbody>      
            </v-simple-table>

            <h4 class="my-4 text-center"> Liste des publications</h4>

            <v-simple-table class="spacing">
                <thead>
                    <tr>
                    <th class="text-left">
                        ID publication
                    </th>
                    <th class="text-left">
                      Nom d'utilisateur
                    </th>
                    <th class="text-left">
                        Supprimer
                    </th>
                    </tr>
                </thead>
                <tbody > 
                    <tr
                    v-for="post in posts"
                    :key="post.id"
                    >
                    <td>{{ post.id }}</td>
                    <td>{{ post.UserId }}</td>
                    <td> <v-btn @click="deletePost(post.id)"><v-icon dense color="red"> mdi-delete </v-icon></v-btn></td>
                    </tr>
                </tbody>      
            </v-simple-table>

              <h4 class="my-4 text-center"> Liste des commentaires</h4>

            <v-simple-table class="spacing">
                <thead>
                    <tr>
                    <th class="text-left">
                        Référence publication
                    </th>
                    <th class="text-left">
                        Référence Utilisateur
                    </th>
                    <th class="text-left">
                        Référence Commentaire
                    </th>
                    <th class="text-left">
                        Supprimer
                    </th>
                    </tr>
                </thead>
                <tbody > 
                    <tr
                    v-for="comment in comments"
                    :key="comment.id"
                    >
                    <td>{{ comment.PostId }}</td>
                    <td>{{ comment.UserId }}</td>
                    <td>{{ comment.id }}</td>
                    <td> <v-btn @click="deleteComment(comment.id)"><v-icon dense color="red"> mdi-delete </v-icon></v-btn></td>
                    </tr>
                </tbody>      
            </v-simple-table>

              
            
          </v-flex>
        </v-container>

      </v-main>

 
    </v-app>
<!-- </div> -->
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
     posts: [],
     comments: [],
     users: [],
     userId: "",
     loading: false,
     token: "",
     showLess: true,
     isAdmin: false,
    }
  },

  created() {
    this.userId = localStorage.getItem("userId");
    this.token = localStorage.getItem("token");
    this.isAdmin = localStorage.getItem("isAdmin");
    this.fetchPost();
    this.fetchComments();  
    this.fetchUsers();  
  },
  
  methods: {
       logout() {
        this.loading = true;
        localStorage.clear();
        this.$router.push('/auth');
    }, 
     async fetchPost() {     
      const token = this.token;
    await  axios.get(`http://localhost:3000/api/post/`,
    { headers: {
          Authorization : `Bearer ${token}`,
         
        }})
     .then(res => {
       this.posts = res.data
       })//.then(console.log(this.posts));
    },

    async  fetchComments() {
      const token = this.token;
    await  axios.get(`http://localhost:3000/api/comment/`,  { headers: {
          Authorization : `Bearer ${token}`,
        }})
     .then(res => {
       this.comments = res.data
       })
     //.then(console.log(this.comments));
    },
    async fetchUsers() {
       const token = this.token;
    
      await  axios.get(`http://localhost:3000/api/user/`, 
      { headers: {
            Authorization : `Bearer ${token}`,
          }})
      .then(res => {
        this.users = res.data
        })
      //.then(console.log(this.comments));
    },

     async deletePost(id) {
    const token = this.token;
        if(confirm("Vous allez supprimez cette publication")) {

          await axios.delete(`http://localhost:3000/api/post/delete/${id}`,
         { headers: {
           Authorization: `Bearer ${token}`,
        }}) 
       .then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
       .catch(error => console.log(error))
           }
    },

  async deleteComment(id) {
    const token = this.token;
        if(confirm("Vous allez supprimez ce commentaire")) {

          await axios.delete(`http://localhost:3000/api/comment/delete/${id}`,
      { headers: {
        Authorization: `Bearer ${token}`,
        }
        })
       .then((response) =>  response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
       .catch(error => console.log(error))
        }
    },

    async deleteUser(id) {
    const token = this.token;

        if(confirm("Vous allez supprimez cet utilisateur")) {

          await axios.delete(`http://localhost:3000/api/user/${id}`,
      { headers: {
        Authorization: `Bearer ${token}`,
        }
        })
       .then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
       .catch(error => console.log(error))
        } 
    },
  }
};

</script>

<style scoped>
.spacing  {
  margin-bottom: 3rem;
}
</style>