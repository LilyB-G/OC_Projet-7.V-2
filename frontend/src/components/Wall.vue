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


          <v-card class="spacing" v-for="post in posts" :key="post.id">
            <div v-if="post.imageUrl">
              <v-img :src="post.imageUrl" aspect-ratio="2.75"></v-img>
            </div>
            <v-card-title secondary-title>
              <div>
                <h3> Auteur: {{ post.User.username }} </h3>
                <h3 class="headline mb-0"> Titre: {{ post.title }}</h3>
                <p align="left">Description: </p>
                <p v-if="(post.UserId != userId)">{{ post.content }} </p>
                <v-text-field label="content" hide-details="auto" :value="post.content" @input="editPost"
                ></v-text-field>
                

              </div>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="black" class="white--text" v-show="userId == post.UserId || isAdmin == 'true'"
                @click="updatePost(post.id,currentPost)" right rounded small>
                <v-icon icon="mdi:pencil" >modifier </v-icon>
              </v-btn>
              <v-btn color="red" class="white--text" v-show="userId == post.UserId || isAdmin == 'true'"
                @click="deletePost(post.id)" right rounded small>
                <v-icon icon="mdi:clear">effacer </v-icon>
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

                <v-row>
                  <v-btn color="#4E5166" elevation="2" @click="addlike(comment.id)">
                    <Icon icon="mdi:thumb-up" />
                  </v-btn>
                  {{ comment.Like }}
                  <v-btn color="#FFD7D7" elevation="2" @click="dislike(comment.id, userId)">
                    <Icon icon="mdi:thumb-down-outline" />

                  </v-btn>
                  {{ comment.disLike }}
                </v-row>



                <v-btn color="red" class="white--text" @click="deleteComment(comment.id)"
                  v-show="userId == comment.UserId || isAdmin == 'true'" depressed right rounded small>
                  <v-icon icon="mdi:Clear"> </v-icon>
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
    this.userId = localStorage.getItem("userId");
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
      const likes = localStorage.getItem("likes");

      let newlike = 0;
      if (likeStatement(idcomment, localStorage.getItem("userId")) == undefined || likeStatement(idcomment, localStorage.getItem("userId")) == 0) { newlike = "1" };
      if (likeStatement(idcomment, localStorage.getItem("userId")) == -1) { newlike = "0+" };

      if (newlike == "1") {


        localStorage.setItem("likes", likes + ',' + idcomment + "|" + localStorage.getItem("userId") + "|" + newlike.substring(0, 1));

      };
      if (newlike == "0+") {
        const array = likes.split(',');
        const newarray = array.filter(r => !r.includes(idcomment + "|" + localStorage.getItem("userId") + "|"));
        localStorage.setItem("likes", newarray.toString());
      };

      const token = this.token;
      axios.post(`http://localhost:3000/api/comment/like/${idcomment}`,
        { CommentId: idcomment, like: newlike },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
        .catch(error => console.log(error));
    },

    async dislike(idcomment) {

      console.log(idcomment)

      const likes = localStorage.getItem("likes").split(',');
      let newlike = 0;
      if (likeStatement(idcomment, localStorage.getItem("userId")) == undefined || likeStatement(idcomment, localStorage.getItem("userId")) == 0) { newlike = "-1" };
      if (likeStatement(idcomment, localStorage.getItem("userId")) == 1) { newlike = "0-" };

      if (newlike == "-1") {
        localStorage.setItem("likes", likes + ',' + idcomment + "|" + localStorage.getItem("userId") + "|" + newlike.substring(0, 1));
      };
      if (newlike == "0-") {
        const array = likes.split(',');
        const newarray = array.filter(r => !r.includes(idcomment + "|" + localStorage.getItem("userId") + "|"));
        localStorage.setItem("likes", newarray.toString());
      };

      const token = this.token;
      axios.post(`http://localhost:3000/api/like/${idcomment}`,
        { CommentId: idcomment, like: newlike },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        .then((response) => response.status >= 200 || response.status <= 201 ? location.reload(true) : console.log(response.status))
        .catch(error => console.log(error));
    },

    causemoi(val) {
      console.log(val);
    },

  },


};


export function likeStatement (idcomment,iduser){
          
          if ( localStorage.getItem("likes") !== null ){
        
            const array = localStorage.getItem("likes");
        
            if (array.includes( idcomment + "|" + iduser + "|-1" )) {
                return -1;
              };
              if (array.includes( idcomment + "|" + iduser + "|1" )) {
                return 1;
              };
              return 0;
        
          }else{
            const str = "";
            localStorage.setItem("likes",str);    
            return 0;
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
</style>