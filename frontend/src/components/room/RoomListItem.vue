<template>
  <div class="q-pa-md">
    <q-card class="scale" style="max-width: 400px">
      <q-img :src="thumbnail" loading="lazy" :ratio="4 / 3" />
      <q-card-section>
        <div class="text-h6">
          {{
            room.title.length > 15
              ? `${room.title.slice(0, 15)}...`
              : room.title
          }}
        </div>
        <div class="text-subtitle2">
          <q-avatar size="md" icon="account_circle"> </q-avatar>{{ email }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
import { api } from "boot/axios";
import { thumbnailsRef } from "boot/firebaseConnection";
import { getDownloadURL } from "@firebase/storage";

export default {
  name: "RoomListItem",
  props: {
    room: {
      type: Object,
    },
  },
  setup(props) {
    const thumbnail = ref("");

    const imgName = ref(props.room.sessionId);
    getDownloadURL(thumbnailsRef(`${imgName.value}.jpg`))
      .then((url) => {
        thumbnail.value = url;
      })
      .catch(() => {
        thumbnail.value =
          "https://img.freepik.com/free-vector/antique-auction-isometric-composition_1284-22062.jpg";
      });

    const email = ref(
      props.room.sessionId.replace("-", "@").replace(/-/g, ".")
    );

    return {
      thumbnail,
      email,
    };
  },
};
</script>
<style>
.scale {
  transform: scale(1);
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  transition: all 0.3s ease-in-out; /* 부드러운 모션을 위해 추가*/
}

.scale:hover {
  cursor: pointer;
  transform: scale(1.1);
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  -o-transform: scale(1.1);
}
</style>
