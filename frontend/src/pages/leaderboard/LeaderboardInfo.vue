<template>
  <div class="list-wrapper">
    <div class="card-wrapper flex column leaderboard-card">
      <h2>Leaderboard</h2>
      <div class="top-charts">
        <div class="top-chart-wrapper">
          <!-- @vue-ignore -->
          <Bar :data="topData" :options="topOptions" />
        </div>
        <div class="podium-wrapper" v-if="allStudents?.length">
          <div class="silver">
            <p>{{ allStudents[1]?.name }}</p>
            <div class="bar"><span>2</span></div>
          </div>
          <div class="gold">
            <p>{{ allStudents[0]?.name }}</p>
            <div class="bar"><span>1</span></div>
          </div>
          <div class="bronze">
            <p>{{ allStudents[2]?.name }}</p>
            <div class="bar"><span>3</span></div>
          </div>
        </div>
      </div>
      <h2>Rank distribution</h2>
      <div class="secondary-leaderboard">
        <div class="pie-chart-wrapper">
          <!-- @vue-ignore -->
          <Bar :data="rankDistributionData" :options="rankDistributionOptions" />
        </div>
        <div class="rank-status">
          <div class="rank-up-wrapper">
            <q-icon name="keyboard_double_arrow_up" />
            <p><b>{{ upperRankDiff }} spots</b> to rank up</p>
          </div>
          <div class="rank-down-wrapper">
            <q-icon name="keyboard_double_arrow_down" />
            <p><b>{{ lowerRankDiff }} spots</b> to rank down</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup props="props">
import { computed, onMounted, ref, watchEffect } from 'vue';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'vue-chartjs';
import axios from 'axios';

ChartJS.register(...registerables)

const props = defineProps({
  yearSelected: String,
  courseSelected: String,
  rank: Number
});

const rankPercentages = [15, 15, 15, 20, 20, 13, 2];

const allStudents = ref()
const studentsByRank = ref<AllRanksInterface[][]>([])

const lowerRankDiff = ref()
const upperRankDiff = ref()
const myRank = ref()

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

const rankNames = ['Junior 1', 'Junior 2', 'Junior 3', 'Mid 1', 'Mid 2', 'Senior', 'Lead'];

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

const getRankIndexes = (ranks: AllRanksInterface[], studentId: number): (number | null)[] => {
  const studentIndex = ranks?.findIndex(e => e.id_student === studentId);

  let result: (number | null)[] = [1, 2, 3];

  if (studentIndex >= 2 && studentIndex <= 6) {
    result.push(studentIndex)
  } else {
    result.push(null)
  }

  result.push(studentIndex-2)
  result.push(studentIndex-1)
  result.push(studentIndex)
  result.push(studentIndex+1)
  result.push(studentIndex+2)
  result.push(null)
  result.push(ranks?.length - 1)
  result.push(ranks?.length)
  return result;
};

const getScoreForLeaderboard = (ranks: AllRanksInterface[], studentId: number): (number | null)[] => {
  if(ranks) {
    const studentIndex = ranks?.findIndex(e => e.id_student === studentId);

    let result: (number | null)[] = [];

    result.push(ranks[0]?.score)
    result.push(ranks[1]?.score)
    result.push(ranks[2]?.score)
    result.push(null)
    result.push(ranks[studentIndex - 2]?.score)
    result.push(ranks[studentIndex - 1]?.score)
    result.push(ranks[studentIndex]?.score)
    result.push(ranks[studentIndex + 1]?.score)
    result.push(ranks[studentIndex + 2]?.score)
    result.push(null)
    result.push(ranks.splice(-2)[0]?.score)
    result.push(ranks.splice(-2)[1]?.score)

    return result;
  }
  return []
};

const topData = computed( () => {
  return {
    labels: getRankIndexes(allStudents.value, 7726),
    datasets: [{
      label: 'My First Dataset',
      data: getScoreForLeaderboard(allStudents.value, 7726),
      backgroundColor: [
        '#3092df80',
        '#3092df80',
        '#3092df80',
        '#3092df80',
        '#3092df80',
        '#3092df80',
        '#80ff00',
        '#3092df80',
        '#3092df80',
        '#3092df80',
      ],
      hoverOffset: 4
    }]
  };
})

const topOptions = computed(() => ({
  responsive: true,
  indexAxis: 'y',
  plugins: {
    legend: { display: false }
  }
}));

interface AllRanksInterface {
  id_student: number,
  first_name: string,
  last_name: string,
  rank: string,
  percent_rank: number
  score: number
  attendedtests: number
  rank_icon: number
}

const assignRank = (students: AllRanksInterface[]) => {
  studentsByRank.value = []
  const reversedArray = students.reverse()

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

  studentsByRank.value = ranks;

  allStudents.value = ranks.flat().reverse();
}

const getMyRankAndNeighbours = (students: AllRanksInterface[], studentId = 7726) => {
  const student = students?.find(e => e.id_student === studentId);

  const lowerIndex = students?.find(e => e.rank_icon == (student?.rank_icon ?? 0) - 1);
  const upperIndex = students?.reverse().find(e => e.rank_icon == (student?.rank_icon ?? 0) + 1);

  myRank.value = student?.rank_icon

  console.log(myRank.value)

  if(lowerIndex && student) {
    lowerRankDiff.value = Number(lowerIndex?.rank) - Number(student.rank)
    upperRankDiff.value = Number(student.rank) - Number(upperIndex?.rank)
  }
  students?.reverse()
}

const fetchAlLRanks = () => {
  const academicYear = Number(props?.yearSelected?.split('/')[0])
  const courseId = Number(props?.courseSelected) || 0
  axios.get(`/api/analytics/all-ranks?academicYear=${academicYear}&courseId=${courseId}`)
    .then(response => {
      allStudents.value = response.data.map((e: AllRanksInterface) => {
        return {
          id_student: e.id_student,
          name: e.first_name + ' ' + e.last_name,
          rank: e.rank,
          percentRank: e.percent_rank.toFixed(4),
          score: e.score,
          attendedtests: e.attendedtests,
          rank_icon: e.rank
        }
      })
      assignRank(allStudents.value)
      getMyRankAndNeighbours(allStudents.value, 7726)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchData = () => {
  if(Number(props?.courseSelected) > 0) {
    fetchAlLRanks()
  }
}

onMounted(fetchData)

watchEffect(() => fetchData())

</script>
