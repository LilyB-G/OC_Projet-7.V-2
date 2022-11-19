<template>
  <v-app>
    <v-main >
    
      <v-container fluid class="fill-height bg">
        <v-row align="center" justify="center">
          <v-col >
            <v-card elevation="12" height="300" class="mx-auto">
              <v-toolbar color="#FD2D01" dark flat>
                <v-toolbar-title>Connectez-vous </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    v-model="user.email"
                    value="email"
                    label="Adresse mail"
                    :rules="user.emailRules"
                    name="email"
                    prepend-icon="mdi-account"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="user.password"
                    label="Mot de passe"
                    :rules="user.passwordRules"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn class="white--text" depressed color="#FD2D01" @click="login" block>Connexion</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import axios from 'axios'

export default {
  name: "Login",
  data () {
        return {
            user: {
                email: '',
                password: '',
                 emailRules: [
                    v => !!v || 'Entrez une adresse mail',
                    v => /.+@.+\..+/.test(v) || 'Adresse invalide',
                ],
                passwordRules: [
                v => !!v || 'Entrez un mot de passe',
                ],
          }
        }
    },
    created() {
        localStorage.clear();
    },

  methods: {
   login() {
       if (this.$refs.form.validate()) {
           axios.post('http://localhost:3000/api/user/login', {
               email: this.user.email,
                password: this.user.password,
            }).then((response) => {
                    if(response.status >= 200 || response.status <= 201) {
                    localStorage.setItem("userId", response.data.UserId)
                    localStorage.setItem("token", response.data.token)
                    localStorage.setItem("isAdmin", response.data.isAdmin)
                    localStorage.setItem("username", response.data.username)
                    this.loading = false;
                    this.$router.push('/');
                    } 
                })
                .catch(err => err == "Error: Request failed with status code 401" ? alert("Vérifiez vos identifiants"): console.log(err));
             }
         }
    },
};
</script>

<style scoped>

</style>
