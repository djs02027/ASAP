<template>
  <q-page padding>
    <q-list v-if="roomList.length" class="row">
      <room-list-item
        class="col-xs-12 col-sm-6 col-md-3"
        v-for="(room, key) in roomList"
        :key="key"
        :room="room"
        @click="info(room)"
      >
      </room-list-item>
    </q-list>
    <q-list class="text-center" v-else>
      <h6 class="text-grey">진행중인 경매가 없습니다.</h6>
    </q-list>
  </q-page>
</template>

<script>
import RoomListItem from "./RoomListItem";
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "RoomList",

  components: {
    RoomListItem,
  },
  setup() {
    const $store = useStore();
    const router = useRouter();

    $store.dispatch("moduleExample/updateList");

    function goLive(sessionId, title, description) {
      $store.commit("user/setIsManage", false);
      // $store.dispatch(
      //   "moduleExample/selectCurrentAuction",
      //   sessionId.replace("@", "-").replace(".", "-")
      // );
      router.push(
        "/live/publisher?sessionId=" +
          sessionId.replace("-", "@").replace(/-/g, ".") +
          "&title=" +
          title +
          "&description=" +
          description
      );
    }

    const roomList = computed({
      get: () => $store.state.moduleExample.roomList,
    });

    const info = (room) => {
      // console.log("room : ", room);
      goLive(room.sessionId, room.title, room.description);
    };

    return {
      roomList,
      info,
      goLive,
    };
  },
};
</script>
