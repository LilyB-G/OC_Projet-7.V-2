<template>
  <!-- <div id="app"> -->
  <v-app id="inspire">

    <v-main>


      <v-container fluid fill-height>
        <v-flex xs12 sm6 offset-sm3>
          <v-card elevation="0" height="300">
            <v-img src="../assets/Groupomania-Logos/icon-left-font-monochrome-black.svg" aspect-ratio="1.75" contain>
            </v-img>
          </v-card>

          <v-row class="mt-3 mx-2">
            <v-btn v-show="isAdmin === 'true'" color="success" small @click="goAdmin"> Page Admin</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="logout" color="red" class="spacing white--text" right small :loading="loading">Déconnexion
            </v-btn>
          </v-row>

          <v-card elevation="12" class="pb-1 my-12">
            <v-toolbar color="#4E5166" dark flat>
              <v-toolbar-title>Ajoutez une publication</v-toolbar-title>
            </v-toolbar>
            <v-form ref="form" class="spacing px-5">
              <v-text-field v-model="title" label="Titre" :rules="inputRules" required></v-text-field>

              <v-text-field v-model="description" label="Description" :rules="inputRules" required></v-text-field>

              <v-file-input id="image" v-model="fileInput" required show-size label="Ajoutez une image" ref="fileInput"
                @change="handleChange"></v-file-input>
              <v-row class="my-2" justify="center">

                <v-btn right color="#FD2D01" elevation="0" class="mr-4 white--text" @click="addPost"
                  :loading="loading2">
                  Publiez !
                </v-btn>
              </v-row>

            </v-form>
          </v-card>

          <h3 class="text-center mb-6"> Dernières publications </h3>


          <v-card class="spacing" v-for="post in posts" :key="post.id" elevation="2">
            <div v-if="post.imageUrl">
              <v-img :src="post.imageUrl" aspect-ratio="2.75"></v-img>
            </div>
            <v-card-title secondary-title>
              <div class="text">
                <h3> Auteur: {{ post.User.username }} </h3>
                <h3 class="headline mb-0"> Titre: {{ post.title }}</h3>
                <p align="left">Description: </p>
                <p v-if="(post.UserId != userId)">{{ post.content }} </p>
                
                <v-text-field label="content" v-else hide-details="auto" :value="post.content" @input="editPost"
                
                ></v-text-field>
                

              </div>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer> 
              <v-btn color="black" class="white--text" v-show="userId == post.UserId || isAdmin == 'true'"
                @click="updatePost(post.id,currentPost)" right rounded small>modifier
                
              </v-btn>
              <v-btn color="red" class="white--text" v-show="userId == post.UserId || isAdmin == 'true'"
                @click="deletePost(post.id)" right rounded small>effacer
               
              </v-btn>
            </v-card-actions>

            <v-card-actions class="my-8 px-4">
              <v-textarea :rules="[(v) => !!v || 'Required']" v-model="comment" auto-grow
                placeholder="Ecrivez vos commentaires" rows="1"> </v-textarea>
              <v-spacer></v-spacer>
              <v-btn @click="addCom(post.id)" small right>Commentez !</v-btn>
            </v-card-actions>


            <v-card v-for="(comment) in comments.filter((comment) => { return comment.PostId == post.id })"
              :key="comment.id">
              <v-card-title>
                {{ comment.User.username }}: {{ comment.content }}
                <v-spacer></v-spacer>

                <v-row >
                  <!-- <p>{{comment}}</</p> -->
                  <p>{{comment.like}} like </p>
                  <v-btn color="#4E5166" elevation="2" @click="addlike(comment.id)" v-if="canlike(comment.id)">
                    <Icon icon="mdi:thumb-up" />
                  </v-btn>
                  <p> - {{ comment.disLike }} dislike </p>
                  <v-btn color="#FFD7D7" elevation="2" @click="dislike(comment.id, userId)" v-if="candislike(comment.id)">
                    <Icon icon="mdi:thumb-down-outline" />
                  </v-btn>
                  
                </v-row>



                <v-btn color="red" class="white--text" @click="deleteComment(comment.id)"
                  v-show="userId == comment.UserId || isAdmin == 'true'" depressed right rounded small>
                  effacer
                </v-btn>
              </v-card-title>

            </v-card>
          </v-card>

        </v-flex>
      </v-container>

    </v-main>


  </v-app>
  <!-- </div> -->
</template>

<script>
import axios from 'axios';
import { Icon } from '@iconify/vue2';

export default {
  data() {
    return {
      posts: [],
      comments: [],
      userId: "",
      loading2: false,
      loading: false,
      token: "",
      sended: "",
      image: "",
      fileInput: [],
      isAdmin: false,
      title: "",
      description: "",
      comment: "",
      inputRules: [
        v => !!v || 'Ce champ ne peut pas être vide',
        v => v.length >= 3 || 'Pas assez long'
      ],
      currentPost:"",
      }
  },
  components: {
    Icon,
  },
  created() {
    this.userId = localStorage.getItem("userId"); //copie les variables du LS dans la page en cours
    this.token = localStorage.getItem("token");
    this.isAdmin = localStorage.getItem("isAdmin");
    this.fetchPost();
    this.fetchComments();
  },
  methods: {
    editPost: function(event){
      if (event){
        console.log( event);
        this.currentPost = event;
      };
    },
    logout() {
      this.loading = true;
      localStorage.clear();
      this.$router.push('/auth');
    },
    handleChange() {
      console.log(this.fileInput);
    },
    async goAdmin() {
      this.isAdmin == 'true' ? this.$router.push('/admin') : alert("Vous n'avez pas accès à cette page");
    },
    async addCom(id) {
      const token = this.token;
      await axios.post(`http://localhost:3000/api/comment/${id}`,
        { PostId: id, content: this.comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }).then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
        .catch(error => console.log(error));
    },
    async addPost() {
      let formData = new FormData();

      formData.append('title', this.title);
      formData.append('content', this.description);
      await formData.append('image', this.fileInput);
      if (this.$refs.form.validate()) {
        this.loading2 = true;
        const token = this.token;
        await axios.post(`http://localhost:3000/api/post/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }).then(
            this.title = "",
            this.description = "",
            this.fileInput = [],
          ).then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.statusText))
          .catch(error => console.log(error))
      }
    },
    async fetchPost() {
      const token = this.token;

      await axios.get(`http://localhost:3000/api/post/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,

          }
        })
        .then((res) => {
          let posts = res.data;

          //console.log(posts)

          return this.posts = res.data
        });
    },
    async fetchComments() {
      const token = await this.token;
      await axios.get(`http://localhost:3000/api/comment/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((res) => {
          return this.comments = res.data
        });
    },
    async deletePost(id) {
      const token = this.token;
      if (confirm("Vous allez supprimez cette publication")) {
        await axios.delete(`http://localhost:3000/api/post/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
          .catch(error => console.log(error))
      }
    },
    async updatePost(id,content) {
 const token = this.token;

        await axios.post(`http://localhost:3000/api/post/update`,
          {
            data:{
              id: id,
              content: content,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
          .catch(error => console.log(error))
      
    },




    async deleteComment(id) {
      const token = this.token;
      if (confirm("Vous allez supprimez ce commentaire")) {

        await axios.delete(`http://localhost:3000/api/comment/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
          .then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
          .catch(error => console.log(error))
      }
    },

    async addlike(idcomment) {
      
      const row = this.comments.find(comment => comment.id == idcomment);
      let newarray= row.usersLiked.split(',');
      let newlikecount=0;
      let newdislikecount=0;

      const strdis = this.userId + "|-1";
      const strli = this.userId + "|1";

      if ( row.usersLiked.indexOf(strdis) > 0 ){                                 // si l'utilisateur a déjà "disliké"
            console.log( "déja dislike" );
          newarray = newarray.filter((r) => { r.usersLiked != strdis });             // suppression de l'action du précédent dislike
            console.log(newarray);
          newlikecount = Number(row.Like) > 0 ? Number(row.Like) : 0;           // compteur like reste inchangé + gestion initialisation si valeur = undefined => compteur=0 
          newdislikecount = Number(row.disLike) > 0 ? Number(row.disLike) - 1 : 0;  // décrémént compteur dislike 
      };

      if ( row.usersLiked.indexOf(strli) == -1 && row.usersLiked.indexOf(strdis) == -1 ){     // si l'utilisateur n'a jamais "liké" / jamais "disliké" et userliked inchangé
          console.log("cas like");
          newarray.push( strli );                                                 // ajout attributs idcomment | iduser | 1
          newlikecount = Number(row.Like) > 0 ? Number(row.Like) + 1 : 1 ;        // incrément compteur like ou compteur = 1 dans le cas ou valeur = undefined
          newdislikecount = Number(row.disLike) > 0 ? Number(row.disLike) : 0 ;   // compteur dislike inchangé + gestion initialisation si valeur = undefined => compteur=0 
      };
      
      if ( newdislikecount > 0 || newlikecount > 0 || newarray != row.usersLiked.split(',')){
              
              
              const token = this.token;
              axios.post(`http://localhost:3000/api/comment/like/${idcomment}`,
                { CommentId: idcomment,
                  usersLiked : newarray.toString(),
                  like: newlikecount.toString(),
                  dislike: newdislikecount.toString(),
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                })
                .then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
                //.then((response) => response.status >= 200 || response.status <= 201 ? console.log("success") : console.log(response.status))
                .catch(error => console.log(error));
              };
    },

    async dislike(idcomment) {

      const row = this.comments.find(comment => comment.id == idcomment);
      let newarray= row.usersLiked.split(',');
      let newlikecount=0;
      let newdislikecount=0;

      const strdis = this.userId + "|-1";
      const strli = this.userId + "|1";

      if ( row.usersLiked.indexOf(strli) > 0 ){                                       // si l'utilisateur a déjà "liké"
            console.log( "déja like" );
          newarray = newarray.filter((r) => { r.usersLiked != strli });                     // suppression de l'action du précédent like
            console.log(newarray);
          newlikecount = Number(row.Like) > 0 ? Number(row.Like) - 1 : 0;             // décrémént compteur like 
          newdislikecount = Number(row.disLike) > 0 ? Number(row.disLike) : 0;        // compteur dislike reste inchangé + gestion initialisation si valeur = undefined => compteur=0 
      };

      if ( row.usersLiked.indexOf(strdis) == -1 && row.usersLiked.indexOf(strli) == -1 ){       // si l'utilisateur n'a jamais "disliké" / jamais "liké" et userliked inchangé
          console.log("cas dislike")
          newarray.push( strdis );                                                    // ajout attributs idcomment | iduser | -1
          newlikecount = Number(row.Like) > 0 ? Number(row.Like) : 0 ;                // compteur like inchangé + gestion initialisation si valeur = undefined => compteur=0 
          newdislikecount = Number(row.disLike) > 0 ? Number(row.disLike) + 1 : 1 ;   // incrément compteur dislike ou compteur = 1 dans le cas ou valeur = undefined
      };      
      
      if ( newdislikecount > 0 || newlikecount > 0 || newarray != row.usersLiked.split(',')){
      
          const token = this.token;
          axios.post(`http://localhost:3000/api/comment/like/${idcomment}`,
            { CommentId: idcomment,
              usersLiked : newarray.toString(),
              like: newlikecount.toString(),
              dislike: newdislikecount.toString(),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            })
            .then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
            //.then((response) => response.status >= 200 || response.status <= 201 ? console.log("success") : console.log(response.status))
            .catch(error => console.log(error));
      };
    },

    canlike(commentId) {

        for (let row of this.comments){

          if (row.id == commentId){
            const array = row.usersLiked != null ? row.usersLiked.split(",") : [];  
            const asliked = this.userId + "|1";
            if ( array.length > 0 && array.includes(asliked)){
              return false
            }
          }
          };

          return true;
    
    },

    candislike(commentId) {
       for (let row of this.comments){

          if (row.id == commentId){
            const array = row.usersLiked != null ? row.usersLiked.split(",") : [];  
            const asliked = this.userId + "|-1";
            if ( array.length > 0 && array.includes(asliked)){
              return false
            }
          }
          };

          return true;
    
    },



  },


};


export function likeStatement (idcomment, comments){
      
      //console.log(comments);
          
        for (let comment of comments){

          if (comment.id == idcomment && comment.userlikes != undefined){
            let array = comment.userlikes.split(',');

            if (array[1]== userId ){
              return array[2];
            }else{
              return 0;
            }

          }
        }
};
  
  
</script>

<style scoped>
.spacing {
  margin-bottom: 3rem;
}

#inspire {
  background-color: #aeadb6;
}

.text{ width: 100%;
}

</style>