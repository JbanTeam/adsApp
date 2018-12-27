<template>
  <v-dialog width="400px" v-model="modal">
    <v-btn class="warning mr-3" flat slot="activator">Edit</v-btn>
    <v-card>
      <v-container>
        <v-layout row>
          <v-flex xs12>
            <v-card-title>
              <h1 class="text--primary">Edit ad</h1>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs12>
            <v-card-text>
              <v-text-field name="title" label="Title" type="text" v-model="editedTitle"></v-text-field>
              <v-text-field name="description" label="Description" type="text" v-model="editedDescription" multi-line></v-text-field>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs12>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click="onCancel" class="elevation-0">Cancel</v-btn>
              <v-btn color="success" @click="onSave" class="elevation-0">Save</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: ['ad'],
    data () {
      return {
        modal: false,
        editedTitle: this.ad.title,
        editedDescription: this.ad.description
      }
    },
    methods: {
      onCancel () { // при отмене, устанавливаем изначальные значения
        this.modal = false
        this.editedTitle = this.ad.title
        this.editedDescription = this.ad.description
      },
      onSave () { // изменяем значения в бд
        if (this.editedTitle !== '' && this.editedDescription !== '') {
          this.$store.dispatch('updateAd', {
            title: this.editedTitle,
            description: this.editedDescription,
            id: this.ad.id
          })
        }
        this.modal = false // закрываем модальное окно
      }
    }
  }
</script>

