<template>

  <v-card
    class="mx-auto"
    title="TestButtons"
  ></v-card>

  <v-btn
    @click="jsontest"
  >
    JsonTest
  </v-btn>


</template>

<script>
import {checkUser, getAuthUser, login, logout} from "@/components/auth/services/auth-helper";
import UserHelper from "@/components/auth/services/user.helper"
import birthdayService from "@/components/microservices/events/birthdays/js/birthday.service";

export default {
  name: "Currencies",

  data: () => ({
    items: [
      {title: 'BYN'},
      {title: 'USD'},
      {title: 'EUR'},
      {title: 'RUB'},
    ],
  }),

  methods: {
    // 643 - RUB
    // 978 - EUR
    // 840 - USD

    async jsontest() {
        await birthdayService.checkServiceStatus();
    },

    logintest() {
      login();
    },
    logouttest() {
      logout();
    },
    apiCall() {
      console.log()
      // eventsService.getEvents();
    },
    userData() {
      console.log(getAuthUser())
    },
    async checkUser() {
      console.log(checkUser())
    },
    userHelperFill() {
      UserHelper.fillLocalsStorageUser();
    }
  }
}
</script>

<style scoped>
.component {
  display: flex;
  /*@media (max-width: 767 px) display: flex;*/
}
</style>
