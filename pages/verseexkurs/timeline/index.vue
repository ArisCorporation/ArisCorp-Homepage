<script setup>
import { Timeline } from 'vue-timeline-chart';
import 'vue-timeline-chart/style.css';

const { readAsyncItems } = useDirectusItems();
const { readAsyncUsers } = useDirectusUsers();

const { data } = await readAsyncItems('timeline_items', {
  query: {
    fields: [
      'id',
      'title',
      'dates',
      'category',
      'description',
      'banner',
      'linked_item.collection',
      'linked_item.item:systems.slug',
      'linked_item.item:companies.slug',
      'linked_item.item:literature_categories.slug',
      'linked_item.item:fractions.slug',
      'linked_item.item:spectrum_categories.slug',
      'linked_item.item:ships.slug',
      'linked_item.item:directus_users.slug',
      'linked_item.item:spectrum_threads.slug',
      'linked_item.item:spectrum_threads.category.slug',
    ],
    limit: -1,
  },
});

const { data: users } = await readAsyncUsers({
  query: {
    fields: [
      'id',
      'first_name',
      'last_name',
      'title',
      'slug',
      'avatar',
      'department.name',
      'department.logo',
      'leading_department.name',
      'leading_department.logo',
      'head_of_department',
      'role.id',
      'role.label',
      'role.name',
      'birthdate',
      'birthplace.name',
    ],
    filter: {
      birthdate: { _nnull: true },
    },
    limit: -1,
  },
  transform: (data) => data.map((user) => transformUser(user)),
});

if (!data.value || !users.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Die Übertragung konnte nicht vollständig empfangen werden!',
    fatal: true,
  });
}

const groups = [
  {
    id: 'epoch',
    label: 'Epochen',
  },
  {
    id: 'company_founding',
    label: 'Firmengründungen',
  },
  {
    id: 'verse_timeline',
    label: 'Verse',
  },
  {
    id: 'ariscorp_timeline',
    label: 'ArisCorp',
  },
  {
    id: 'one_day_in_history',
    label: 'Ein Tag in der Geschichte',
  },
];

let items = data.value.map((item) => ({
  id: item.id,
  group: item.category,
  type: item.dates.length === 1 ? 'point' : 'range',
  start: new Date(
    item.dates.find((e) => e.type === 'start')?.year,
    item.dates.find((e) => e.type === 'start')?.month ?? 0,
    item.dates.find((e) => e.type === 'start')?.day ?? 1,
  ).getTime(),
  ...(item.dates.length === 2 && item.dates.find((e) => e.type === 'end').until_now
    ? {
        end: new Date(new Date().getFullYear() + 930, new Date().getMonth(), new Date().getDate()).getTime(),
      }
    : item.dates.length === 2
      ? {
          end: new Date(
            item.dates.find((e) => e.type === 'end')?.year,
            item.dates.find((e) => e.type === 'end')?.month ?? 0,
            item.dates.find((e) => e.type === 'end')?.day ?? 1,
          ).getTime(),
        }
      : {}),
  start_date: item.dates.find((e) => e.type === 'start'),
  end_date: item.dates.find((e) => e.type === 'end'),
  title: item.title,
  description: item.description,
  banner: item.banner,
  linked_item: item.linked_item,
  cssVariables: {
    '--item-background':
      item.category === 'ariscorp_timeline'
        ? '#00ffe8'
        : item.category === 'verse_timeline'
          ? '#1d4ed8'
          : item.category === 'one_day_in_history'
            ? '#16a34a'
            : item.category === 'company_founding'
              ? '#dc2626'
              : item.category === 'epoch'
                ? '#eaa75f'
                : '',
  },
  link:
    item.linked_item[0]?.collection === 'systems'
      ? `/verseexkurs/starmap/${item.linked_item[0]?.item?.slug}`
      : item.linked_item[0]?.collection === 'companies'
        ? `/verseexkurs/companies/${item.linked_item[0]?.item?.slug}`
        : item.linked_item[0]?.collection === 'literature_categories'
          ? `/verseexkurs/literatures/${item.linked_item[0]?.item?.slug}`
          : item.linked_item[0]?.collection === 'fractions'
            ? `/verseexkurs/fractions/${item.linked_item[0]?.item?.slug}`
            : item.linked_item[0]?.collection === 'spectrum_categories'
              ? `/verseexkurs/spectrum/${item.linked_item[0]?.item?.slug}`
              : item.linked_item[0]?.collection === 'ships'
                ? `/shipexkurs/ships/${item.linked_item[0]?.item?.slug}`
                : item.linked_item[0]?.collection === 'spectrum_threads'
                  ? `/verseexkurs/spectrum/${item.linked_item[0]?.item?.category?.slug}/${item.linked_item[0]?.item?.slug}`
                  : null,
}));

items.push(
  ...users.value.map((user) => ({
    id: user.id,
    group: 'ariscorp_timeline',
    type: 'point',
    start: new Date(user.birthdate).getTime(),
    title: `${user.full_name}${user.full_name.endsWith('s') ? "'" : "'s"} Geburtstag`,
    description: `${user.full_name} wurde am ${new Date(user.birthdate).toLocaleDateString()}${user.birthplace ? ` in der Stadt: ${user.birthplace.name}` : ''} geboren.`,
    banner: user.avatar,
    cssVariables: { '--item-background': '#00ffe8' },
    link: `/biography/${user.slug}`,
    start_date: {
      day: new Date(user.birthdate).getDate(),
      month: new Date(user.birthdate).getMonth() + 1,
      year: new Date(user.birthdate).getFullYear(),
    },
  })),
);

items = items.sort((a, b) => a.start - b.start);

const totalRange = ref({
  start: new Date(
    new Date(items[0].start).getFullYear() - 2,
    new Date(items[0].start).getMonth(),
    new Date(items[0].start).getDate(),
  ).getTime(),
  end:
    new Date(items[items.length - 1]?.end ? items[items.length - 1]?.end : items[items.length - 1]?.start).getTime() +
    2 * 365 * 24 * 60 * 60 * 1000,
});
const viewport = ref({
  start: new Date(
    new Date(items[0].start).getFullYear() - 2,
    new Date(items[0].start).getMonth(),
    new Date(items[0].start).getDate(),
  ).getTime(),
  end: new Date(items[2]?.end ? items[2]?.end : items[2]?.start).getTime() + 2 * 365 * 24 * 60 * 60 * 1000,
});
const selectedEvent = ref(items[0]);

function selectNextItem() {
  const currentIndex = items.findIndex((item) => item.id === selectedEvent.value.id);
  const nextIndex = (currentIndex + 1) % items.length;
  selectedEvent.value = items[nextIndex];
}

function selectPreviousItem() {
  const currentIndex = items.findIndex((item) => item.id === selectedEvent.value.id);
  const nextIndex = (currentIndex - 1 + items.length) % items.length;
  selectedEvent.value = items[nextIndex];
}

console.log(items);
definePageMeta({
  layout: 'verse-exkurs',
});
console.log(Timeline);
</script>

<template>
  <div class="flex flex-col max-h-screen min-h-screen py-1">
    <div class="relative flex-grow h-[calc(100vh_-_530px)]">
      <div class="absolute top-0 bottom-0 my-auto -left-4 h-fit">
        <button class="opacity-50 size-10 animate-link hover:opacity-100" @click="selectPreviousItem">
          <UIcon name="i-heroicons-chevron-left-16-solid" class="size-full" />
        </button>
      </div>
      <div class="absolute top-0 bottom-0 my-auto -right-4 h-fit">
        <button class="opacity-50 size-10 animate-link hover:opacity-100" @click="selectNextItem">
          <UIcon name="i-heroicons-chevron-right-16-solid" class="size-full" />
        </button>
      </div>
      <div class="grid h-full max-h-full px-8 overflow-clip lg:grid-cols-2 gap-x-2 gap-y-4">
        <div class="h-full overflow-y-auto">
          <div class="flex text-industrial-400">
            <p class="p-0">
              {{
                new Date(selectedEvent.start).toLocaleDateString('de-DE', {
                  ...(selectedEvent.start_date.year && {
                    year: 'numeric',
                  }),
                  ...(selectedEvent.start_date.month && {
                    month: 'long',
                  }),
                  ...(selectedEvent.start_date.day && {
                    day: 'numeric',
                  }),
                })
              }}
              <template v-if="selectedEvent.end">
                <span class="text-tbase"> - </span>
                {{
                  selectedEvent.end_date.until_now
                    ? 'Bis Heute'
                    : new Date(selectedEvent.end).toLocaleDateString('de-DE', {
                        ...(selectedEvent.end_date.year && {
                          year: 'numeric',
                        }),
                        ...(selectedEvent.end_date.month && {
                          month: 'long',
                        }),
                        ...(selectedEvent.end_date.day && {
                          day: 'numeric',
                        }),
                      })
                }}
              </template>
            </p>
          </div>
          <h1 class="text-left text-aris-400">{{ selectedEvent.title }}</h1>
          <Editor :model-value="selectedEvent.description" read-only class="text-justify" />
          <div v-if="selectedEvent.link">
            <hr class="hr-short" />
            <div class="animate-link w-fit">
              <NuxtLink :to="selectedEvent.link">Mehr lesen</NuxtLink>
            </div>
          </div>
        </div>
        <div class="max-h-full m-auto">
          <NuxtImg
            :src="selectedEvent.banner ?? '8436448c-0c93-430e-a2bf-34493dc15ca3'"
            class="object-cover w-full h-full max-h-full"
          />
        </div>
      </div>
    </div>
    <hr />
    <div>
      <Timeline
        v-if="items[0]"
        :items="items"
        :groups="groups"
        :viewport-min="totalRange.start"
        :viewport-max="totalRange.end"
        :initial-viewport-start="viewport.start"
        :initial-viewport-end="viewport.end"
        :max-zoom-speed="20"
        :active-items="[selectedEvent.id]"
        class="ac-timeline"
        @change-viewport="viewport = $event"
        @click="(e) => e.item && (selectedEvent = e.item)"
      />
      <h5 class="mt-6 mb-2 test-industrial-500">Karte:</h5>
      <Timeline
        :items="[...items, { type: 'background', start: viewport.start, end: viewport.end }]"
        :groups="groups.map((group) => ({ ...group, label: '' }))"
        :viewport-min="totalRange.start"
        :viewport-max="totalRange.end"
        :min-viewport-duration="totalRange.end"
        inert
        class="map"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ac-timeline {
  :deep(.active) {
    --item-background: #fff !important;
  }
}
.map {
  --group-items-height: 0.25em;
  --group-border-top: 0;
  --label-padding: 0;
  --group-padding-top: 0.05em;
  --group-padding-bottom: 0.05em;

  :deep(.group:first-of-type) {
    padding-top: 1rem;
  }

  :deep(.group:nth-of-type(5)) {
    padding-bottom: 1rem;
  }

  :deep(.background) {
    --item-background: color-mix(in srgb, currentcolor, transparent 90%);
  }
}
</style>