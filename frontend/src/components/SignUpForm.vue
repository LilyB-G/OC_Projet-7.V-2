<template>
  <v-app>
    <v-main class="mt-1">
    
      <v-container fluid class="fill-height bg">
        <v-row align="center" justify="center">
          <v-col>
            <v-card elevation="12" class="mx-auto mt-8">
              <v-toolbar color="#4E5166" dark flat>
                <v-toolbar-title>Inscription</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    v-model="user.email"
                    :rules="user.emailRules"
                    value="email"
                    label="Adresse mail"
                    name="email"
                    prepend-icon="mdi-email"
                    type="text"
                    
                  ></v-text-field>
                  <v-text-field
                    v-model="user.username"
                    :rules="user.nameRules"
                    value="username"
                    label="Nom d'utilisateur"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="user.password"
                    label="Mot de passe"
                    name="password"
                    :rules="[user.passwordRules.requirePassword,
                            user.passwordRules.minimumCharacter,
                            user.passwordRules.atleastOneLowerCaseCharacter,
                            user.passwordRules.atleastOneUpperCaseCharacter,
                            user.passwordRules.atleastOneDigit,
                            user.passwordRules.atleastOneSymbol]"
                    prepend-icon="mdi-lock"
                    type="password"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn depressed class="white--text" color="#4E5166" @click="signup" block>Inscrivez-vous</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import axios from "axios"

export default {
  name: "SignUp",
  data () {
        return {
            user: {
                email: '',
                password: '',
                isAdmin: false,
                username: '',
                passwordRules: {          
                    requirePassword: (value) => !!value || 'Un mot de passe est requis',
                    minimumCharacter: (value) =>
                    (value && value.length >= 10) || '10 caractères minimum',
                    atleastOneLowerCaseCharacter: (value) =>
                    /(?=.*[a-z])/.test(value) || 'Ajoutez une minuscule',
                    atleastOneUpperCaseCharacter: (value) =>
                    /(?=.*[A-Z])/.test(value) || 'Ajoutez une majuscule',
                    atleastOneDigit: (value) =>
                    /(?=.*[0-9])/.test(value) || 'Ajoutez un chiffre',
                    atleastOneSymbol: (value) =>
                    /(?=.*\W)/.test(value) || 'Ajoutez un symbole',
                },
                    nameRules: [
                        v => !!v || 'Ajoutez un nom',
                        (value) =>/(?=.*[^\s-])/.test(value) || "Pas d'espace",
                        v => (v && v.length <= 15) || 'Choisissez-en un plus court',
                        v => (v && v.length >= 5) || '5 caractères au moins',
                        
                    ],
                    emailRules: [
                        v => !!v || 'Ajoutez une adresse mail',
                        v => /.+@.+\..+/.test(v) || 'Adresse mail invalide',
                    ],                
            }
        }
    },
    created() {
        localStorage.clear();
    },
  methods: {
   signup() {
       if (this.$refs.form.validate()) {
           axios.post('http://localhost:3000/api/user/signup', {
                email: this.user.email,
                isAdmin: false,
                username: this.user.username,
                password: this.user.password,
            }).then((response) => {
                   if(response.status >= 200 || response.status <= 201) {
                    localStorage.setItem("userId", response.data.UserId)
                    localStorage.setItem("token", response.data.token)
                    localStorage.setItem("isAdmin", response.data.isAdmin)
                    localStorage.setItem("username", response.data.username)
                    console.log(response);
                    this.$router.push('/');
                    } 
                    console.log(response);
                }).catch(err => err == "Error: Request failed with status code 401" ? alert("Utilisateur existant"): console.log(err));
            }
         }
        
  }
};
</script>

<style scoped>

</style>
