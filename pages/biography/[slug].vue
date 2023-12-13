<script setup lang="ts">
const { getItems } = useDirectusItems();
const { params } = useRoute();
const { share, isSupported } = useShare({
  title: 'Hello',
  text: 'Hello my friend',
  url: 'http://10.1.40.13:3000/biography/thomas-blakeney',
});

const { data } = await useAsyncData(
  'member',
  () =>
    getItems({
      collection: 'member',
      params: {
        fields: [
          'firstname',
          'lastname',
          'title',
          'member_potrait.id',
          'roles',
          'position_level',
          'head_of_department',
          'head_department',
          'department',
          'sex',
          'birthdate',
          'birthPlace',
          'birthSystem.name',
          'birthSystem.slug',
          'currentResidence',
          'currentResidenceSystem.name',
          'currentResidenceSystem.slug',
          'ueeState',
          'citizenReason',
          'dutyPeriod',
          'dutyReason',
          'dutyInfo',
          'educationName',
          'educationPeriod',
          'educationPlace',
          'hairColor',
          'eyeColor',
          'height',
          'weight',
          'hobbys',
          'habits',
          'talents',
          'tics',
          'activities',
          'mysteriousThings',
          'characterTrait',
          'fears',
          'books',
          'music',
          'movies',
          'colors',
          'clothing',
          'food',
          'drink',
          'alcohol',
          'loves',
          'hates',
          'text',
          'biography',
          'ships.id',
          'ships.department.gameplay_name',
          'ships.department.gameplay_logo',
          'ships.ships_id.name',
          'ships.ships_id.slug',
          'ships.ships_id.storeImage.id',
          'ships.ships_id.manufacturer.firmen_name',
          'ships.ships_id.manufacturer.slug',
        ],
        filter: {
          slug: { _eq: params.slug },
        },
      },
    }),
  {
    transform: (data) => {
      return transformMember(data[0]);
    },
  },
);

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Member does not exist!',
    fatal: true,
  });
}
const test = ref(false);
const handleShare = () => {
  // window.alert('test');
  test.value = true;
  // if (isSupported) {
  //   share();
  // } else {
  //   window.alert('Not supported');
  // }
};
</script>

<template>
  <div>
    <div class="flex justify-between">
      <div>
        <h1 class="mb-auto italic text-white">{{ data?.fullName }}</h1>
        <p v-if="data?.roles" class="text-white uppercase">
          <span class="text-btertiary">Rollen:</span> {{ data?.roles.join(', ') }}
        </p>
      </div>
      <NuxtLink class="mt-auto w-fit h-fit" to="/VerseExkurs/companies/ariscorp">
        <Icon name="IconsLogosAriscorp" class="w-24 h-fit" />
      </NuxtLink>
    </div>
    <hr class="mt-0" />
    <div class="grid xl:grid-cols-3 gap-y-4 gap-x-2">
      <div class="xl:col-span-1">
        <DefaultPanel>
          <NuxtImg class="max-h-96 aspect-potrait object-cover w-full xl:h-[498px] xl:max-h-fit" :src="data?.potrait" />
        </DefaultPanel>
        {{ test }}
        <ButtonDefault class="mt-2" @click="handleShare">
          <Icon name="material-symbols:ios-share-rounded" />
        </ButtonDefault>
      </div>
      <div class="space-y-4 uppercase xl:col-span-2">
        <TableParent title="Basis">
          <TableRow title="Bürgerlicher Name" :content="data?.fullName" full-width />
          <TableHr />
          <TableRow title="Geburtsdatum" :content="data?.birthdate" />
          <TableRow title="Alter" :content="$dayjs().add(930, 'years').to(data?.birthdate, true)" />
          <TableRow title="Geburtsort" :content="data?.birthplace" />
          <TableRow
            title="Geburtssystem"
            :content="data?.birthsystem?.name"
            :link="'/VerseExkurs/systems/' + data?.birthsystem?.slug"
          />
          <TableRow title="Aktueller Wohnort" :content="data?.currentplace" />
          <TableRow
            title="Geburtssystem"
            :content="data?.currentsystem?.name"
            :link="'/VerseExkurs/systems/' + data?.currentsystem?.slug"
          />
          <TableHr />
          <TableRow title="Körpergrösse" :content="data?.height + ' cm'" />
          <TableRow title="Körpergewicht" :content="data?.weight + ' kg'" />
          <TableRow title="Haarfarbe" :content="data?.haircolor" />
          <TableRow title="Augenfarbe" :content="data?.eyecolor" />
          <TableHr />
          <TableRow title="Bürgerstatus" :content="data?.ueestate" />
          <TableRow
            title="Bürgerschaftsverdienst"
            :content="data?.ueestate?.toLowerCase() === 'citizen' ? data?.citizenreason : null"
          />
          <template
            v-if="data?.ueestate?.toLowerCase() === 'citizen' && data?.citizenreason?.toLowerCase() === 'militärdienst'"
          >
            <TableRow title="Dienstzeit" :content="data?.duty.dutyperiod" />
            <TableRow title="Dienstende" :content="data?.duty.dutyreason" />
          </template>
          <template
            v-if="
              data?.ueestate?.toLowerCase() === 'citizen' && data?.citizenreason?.toLowerCase() === 'besondere bildung'
            "
          >
            <TableRow title="Studiengang" :content="data?.education.eduname" />
            <TableRow title="Studiumszeitraum" :content="data?.education.eduperiod" />
            <TableRow title="Studiumsort" :content="data?.education.eduplace" full-width />
          </template>
        </TableParent>
        <TableParent title="Spezifisch">
          <TableRow title="Hobbys" :content="data?.hobbys" is-list />
          <TableRow title="Angewohnheiten" :content="data?.habits" is-list />
          <TableRow title="Talente" :content="data?.talents" is-list />
          <TableRow title="Tics & Marotten" :content="data?.tics" is-list />
          <TableRow title="Freizeitgestaltung" :content="data?.activities" is-list />
          <TableRow title="Rätselhafte Züge" :content="data?.mysterious" is-list />
          <TableRow title="Hervorstechender Charakterzug" :content="data?.character" is-list />
          <TableRow title="Ängste" :content="data?.fears" is-list />
        </TableParent>
        <TableParent title="Geschmack">
          <TableRow title="Bücher" :content="data?.books" third is-list />
          <TableRow title="Musik" :content="data?.music" third is-list />
          <TableRow title="Filme" :content="data?.movies" third is-list />
          <TableHr />
          <TableRow title="Typische Kleidung" :content="data?.clothing" is-list />
          <TableRow title="Lieblingsfarben" :content="data?.colors" is-list />
          <TableHr />
          <TableRow title="Lieblingsgericht" :content="data?.food" third is-list />
          <TableRow title="Lieblingsgetränk" :content="data?.drink" third is-list />
          <TableRow title="Lieblingsalkohol" :content="data?.alcohol" third is-list />
          <TableHr />
          <TableRow :title="data?.pronom + ' Liebt...'" :content="data?.loves" is-list />
          <TableRow :title="data?.pronom + ' Hasst...'" :content="data?.hates" is-list />
        </TableParent>
      </div>
    </div>
    <hr />
    <DefaultPanel>
      <div class="bg-bprimary">
        <h1 class="p-4 pt-6 m-0 text-primary">Bigorafie:</h1>
        <div class="mx-auto max-w-[95%]" v-html="data?.biography" />
      </div>
    </DefaultPanel>
    <hr />
    <Disclosure>
      <template #title>
        Schiffe von <span class="text-primary">{{ data?.fullName }}</span>
      </template>
      <div class="flex flex-wrap">
        <ShipCard
          v-for="ship in data?.hangar"
          :key="ship.id"
          :ship-data="ship.ship"
          :hangar-data="ship"
          display-department
        />
      </div>
    </Disclosure>
  </div>
</template>