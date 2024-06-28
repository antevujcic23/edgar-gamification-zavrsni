<template>
  <div class="list-wrapper">
    <div class="card-wrapper flex column leaderboard-card">
      <div class="two-column-wrapper">
        <div class="two-column-element">
          <h2>Rank distribution</h2>
          <!-- @vue-ignore -->
          <Bar :data="rankDistributionData" :options="rankDistributionOptions" />
        </div>
        <div class="podium-wrapper" v-if="studentRows?.length">
          <div class="silver">
            <p>{{ studentRows[1]?.name }}</p>
            <div class="bar"><span>2</span></div>
          </div>
          <div class="gold">
            <p>{{ studentRows[0]?.name }}</p>
            <div class="bar"><span>1</span></div>
          </div>
          <div class="bronze">
            <p>{{ studentRows[2]?.name }}</p>
            <div class="bar"><span>3</span></div>
          </div>
        </div>
      </div>
      <div class="two-column-wrapper">
        <div class="two-column-element">
          <div class="h2-with-icon">
            <h2>Finished exercises</h2>
            <img src="~assets/trophy-icon.png" width="40px">
          </div>
          <!-- @vue-ignore -->
          <Bar :data="exerciseDistribuiton" :options="exerciseDistribuitonOptions" />
        </div>
        <div class="two-column-element">
          <div class="h2-with-icon">
            <h2>Finished tutorials</h2>
            <img src="~assets/achievement-award-medal-icon.png" width="40px">
          </div>
          <!-- @vue-ignore -->
          <Bar :data="tutorialsDistribuiton" :options="tutorialsDistribuitonOptions" />
        </div>
      </div>
      <!-- @vue-ignore -->
      <q-table
        flat
        :rows="studentRows"
        :columns="studentColumns"
        row-key="name"
        hide-bottom
        :pagination="initialPagination"
        class="width-100"
      >
        <template v-slot:body-cell="props">
          <q-td
            :props="props"
          >
            <template v-if="props.col.field === 'rank_icon'">
              <div class="rank-icon-wrapper">
              <div class="rank-icon">
                <div :class="['rank-background', 'rank-' + props.value]"></div>
                <template v-if="props.value">
                  <img width="25px" :src="'img/rank' + props.value + '.png'" alt="">
                  <q-tooltip
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                  >
                    {{rankNames[props.value - 1]}}
                  </q-tooltip>
                </template>
              </div>
              </div>
            </template>
            <template v-if="props.col.field === 'finished_exercises'">
              <div class="achivement-wrapper">
                {{ props.value }}
                <img src="~assets/trophy-icon.png" width="22px">
              </div>
            </template>
            <template v-if="props.col.field === 'finished_tutorials'">
              <div class="achivement-wrapper">
                {{ props.value }}
                <img src="~assets/achievement-award-medal-icon.png" width="20px">
              </div>
            </template>
            <template v-if="props.col.field !== 'finished_exercises' && props.col.field !== 'finished_tutorials' && props.col.field !== 'rank_icon'">
              <div class="teacher-table-cell">
              {{ props.value }}
              </div>
            </template>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script lang="ts" setup props="props">
import { computed, onMounted, ref, watchEffect } from 'vue';
import axios from 'axios';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables)

const props = defineProps({
  yearSelected: String,
  courseSelected: String
});

const initialPagination = ref({
  rowsPerPage: 2000
});

const studentsByRank = ref<AllRanksInterface[][]>([])

const myRank = ref()
const numberOfExercises = ref()

const groupDistributionData = (data: AllRanksInterface[]) => {
  const categories = [0, 5, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  type CategoryCounts = { [key: number]: number };

  const categoryCounts: CategoryCounts = categories.reduce((acc: CategoryCounts, category: number) => {
    acc[category] = 0;
    return acc;
  }, {} as CategoryCounts);

  data?.forEach(value => {
    const percentage = (Number(value.finished_exercises) / numberOfExercises.value) * 100;
    const category = categories.find(cat => percentage <= cat);
    if (category !== undefined) {
      categoryCounts[category]++;
    }
  });

  return categoryCounts;
};

const groupDistributionDataForTutorials = (data: AllRanksInterface[]) => {
  const categories = [0, 5, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  type CategoryCounts = { [key: number]: number };

  const categoryCounts: CategoryCounts = categories.reduce((acc: CategoryCounts, category: number) => {
    acc[category] = 0;
    return acc;
  }, {} as CategoryCounts);

  data?.forEach(value => {
    const percentage = (Number(value.finished_tutorials) / (Number(data[0].open_tutorials) + Number(data[0].finished_tutorials))) * 100;
    const category = categories.find(cat => percentage <= cat);
    if (category !== undefined) {
      categoryCounts[category]++;
    }
  });

  return categoryCounts;
};

const exerciseDistribuiton = computed(() => ({
  labels: ['0','5','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100'],
  datasets: [{
    data: groupDistributionData(studentRows.value),
    backgroundColor: new Array(21).fill('#3092df80'),
    hoverBackgroundColor: new Array(21).fill('#3092df80')
  }],
}));

let exerciseDistribuitonOptions = ref({
  responsive: true,
  scales: {
    y: {
      title: { display: true, text: '# of students' },
      beginAtZero: true
    },
    x: {
      title: { display: true, text: 'finished %' },
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { title: function() { return null; } }
    }
  }
});


const tutorialsDistribuiton = computed(() => ({
  labels: ['0','5','15','20','25','30','35','40','45','50','55','60','65','70','75','80','85','90','95','100'],
  datasets: [{
    data: groupDistributionDataForTutorials(studentRows.value),
    backgroundColor: new Array(21).fill('#3092df80'),
    hoverBackgroundColor: new Array(21).fill('#3092df80')
  }],
}));

let tutorialsDistribuitonOptions = ref({
  responsive: true,
  scales: {
    y: {
      title: { display: true, text: '# of students' },
      beginAtZero: true
    },
    x: {
      title: { display: true, text: 'finished %' },
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { title: function() { return null; } }
    }
  }
});

const rankDistribution = (data: AllRanksInterface[][]) => {
  if(data?.length) {
    return [
      data[0].length ?? 0,
      data[1]?.length ?? 0,
      data[2]?.length ?? 0,
      data[3]?.length ?? 0,
      data[4]?.length ?? 0,
      data[5]?.length ?? 0,
      data[6]?.length ?? 0
    ]
  } else {
    return [0,0,0,0,0,0,0]
  }
}

const rankDistributionData = computed(() => ({
  labels: rankNames,
  datasets: [{
    data: rankDistribution(studentsByRank.value),
    backgroundColor: [
      '#00819c',
      '#0575f5',
      '#0905f5',
      '#9a05f7',
      '#FF00FF',
      '#ff0000',
      '#f0d975'
    ],
    hoverOffset: 4
  }],
}));

const markMeOnGraph = (rank: number) => {
  return rankNames.map((l) => ({ weight: l == rankNames[(rank ?? 1) - 1] ? 'bold' : 'normal' }))
}
let rankDistributionOptions = computed(() => ({
  responsive: true,
  scales: {
    y: {
      title: { display: true, text: '# of students' },
      beginAtZero: true
    },
    x: {
      title: { display: true, text: 'rank' },
      ticks: {
        font: markMeOnGraph(myRank.value ?? 0)
      }
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { title: function() { return null; } }
    }
  }
}));

interface AllRanksInterface {
  id_student: number,
  first_name: string,
  last_name: string,
  rank: string,
  percent_rank: number
  score: number
  attendedtests: number,
  open_exams: string,
  open_exercises: string,
  finished_exams: string,
  finished_exercises: string,
  open_tutorials: string,
  finished_tutorials: string,
  all_exercises: string
}

const rankNames = ['Junior 1', 'Junior 2', 'Junior 3', 'Mid 1', 'Mid 2', 'Senior', 'Lead'];
const rankPercentages = [15, 15, 15, 20, 20, 13, 2];

const studentColumns = [
  {
    name: 'rank',
    label: '#',
    field: 'rank',
    required: true,
    align: 'left',
    sortable: false},
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    required: true,
    align: 'left',
    sortable: false
  },
  { name: 'name', label: 'Name', field: 'name', required: true, align: 'left', sortable: false },
  { name: 'exams', label: 'Finished exams', field: 'exams', required: true, align: 'right', sortable: false },
  { name: 'finished_exercises', label: 'Finished exercises', field: 'finished_exercises', required: true, align: 'right', sortable: false },
  { name: 'finished_tutorials', label: 'Finished tutorials', field: 'finished_tutorials', required: true, align: 'right', sortable: false },
  { name: 'percentRank', label: 'Percentile rank', field: 'percentRank', required: true, align: 'right', sortable: false },
  { name: 'score', label: 'Score', field: 'score', required: true, align: 'right', sortable: false },
  { name: 'rank_icon', label: 'Rank', field: 'rank_icon', required: true, align: 'right', sortable: false }
]

const studentRows = ref()

const assignRank = (students: AllRanksInterface[]) => {
  const reversedArray = students.reverse()

  studentsByRank.value = []
  const ranks: AllRanksInterface[][] = [];

  let startIndex = 0;
  for (let i = 0; i < rankNames.length; i++) {
    const numStudentsPerRank = Math.ceil(students.length * (rankPercentages[i] / 100));

    const endIndex = Math.min(startIndex + numStudentsPerRank, students.length);

    ranks.push(reversedArray.slice(startIndex, endIndex).map(student => ({
      ...student,
      rank_icon: i+1
    })));

    startIndex = endIndex;
  }

  const flattenedRanks = ranks.flat();

  studentsByRank.value = ranks;
  studentRows.value = flattenedRanks.reverse();

  return flattenedRanks;
}

const fetchAlLRanks = () => {
  const academicYear = Number(props?.yearSelected?.split('/')[0])
  const courseId = Number(props?.courseSelected) || 0
  axios.get(`/api/analytics/all-ranks?academicYear=${academicYear}&courseId=${courseId}`)
    .then(response => {
      studentRows.value = response.data.map((e: AllRanksInterface) => {
        return {
          id: e.id_student,
          name: e.first_name + ' ' + e.last_name,
          rank: e.rank,
          percentRank: e.percent_rank.toFixed(4),
          score: e.score,
          attendedtests: e.attendedtests,
          exams: e.finished_exams,
          finished_exercises: e.finished_exercises,
          finished_tutorials: e.finished_tutorials,
          open_tutorials: e.open_tutorials,
          rank_icon: e.rank,
          all_exercises: e.all_exercises
        }
      })

      numberOfExercises.value = Math.max(...studentRows.value.map((e: AllRanksInterface) => e.all_exercises))

      assignRank(studentRows.value)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchData = () => {
  fetchAlLRanks()
}

onMounted(fetchData)

watchEffect(() => fetchData())

</script>
