<template>
  <div class="list-wrapper">
    <div class="card-wrapper">
      <div class="doughnut-stats">
        <div class="doughnut-info">
          <h3>Rank</h3>
          <p><b>#{{ mainInfo?.rank }}</b> /{{ mainInfo?.maxRank }}</p>
          <div class="doughnut-wrapper">
            <div class="doughnut-graph">
              <Doughnut :data="percentileData" :options="percentileOptions" />
              <span>{{ Math.round(mainInfo?.percentileRank) }}%</span>
            </div>
            <h5>Percentile</h5>
          </div>
        </div>
        <div class="vertical-separator"></div>
        <div class="doughnut-info">
          <h3>Points</h3>
          <p><b>{{ mainInfo?.winnedscore }}</b> /{{ mainInfo?.maxwinnablescore }}</p>
          <div class="doughnut-box">
            <div class="doughnut-wrapper">
              <div class="doughnut-graph">
                <Doughnut :data="scorePercentageData" :options="scorePercentageOptions" />
                <span>{{ Math.round((mainInfo?.winnedscore / mainInfo?.maxwinnablescore) * 100) }}%</span>
              </div>
              <h5>Overall</h5>
            </div>
            <div class="doughnut-wrapper">
              <div class="doughnut-graph">
                <Doughnut :data="scoreAttemptedData" :options="scoreAttemptedOptions" />
                <span>{{ Math.round(mainInfo?.score) }}%</span>
              </div>
              <h5>% attempted</h5>
            </div>
          </div>
        </div>
        <div class="vertical-separator"></div>
        <div class="doughnut-info">
          <h3>Exams taken</h3>
          <p><b>{{ mainInfo?.attendedtests }}</b> /{{ mainInfo?.heldtests }}</p>
          <div class="doughnut-box">
            <div class="doughnut-wrapper">
              <div class="doughnut-graph">
                <Doughnut :data="minScoreData" :options="minScoreOptions" />
                <span>{{ Math.round(mainInfo?.minscore) }}%</span>
              </div>
              <h5>Min score</h5>
            </div>
            <div class="doughnut-wrapper">
              <div class="doughnut-graph">
                <Doughnut :data="maxScoreData" :options="maxScoreOptions" />
                <span>{{ Math.round(mainInfo?.maxscore) }}%</span>
              </div>
              <h5>Max score</h5>
            </div>
            <div class="doughnut-wrapper">
              <div class="doughnut-graph">
                <Doughnut :data="avgScoreData" :options="avgScoreOptions" />
                <span>{{ Math.round(mainInfo?.avgscore) }}%</span>
              </div>
              <h5>Average score</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-wrapper">
      <div class="select-exam">
        <h2>Exam: </h2>
        <q-select
          outlined
          v-model="examSelected"
          :options="availableExams"
          @update:model-value="getDataForSelectedExam()"
        />
      </div>
      <div class="exam-graph-wrapper">
        <div class="exam-graphs">
          <p>Exam score % distribution (students: {{ examInfo?.maxRank }})
            <span class="info-icon">
              <q-icon name="info_outline" />
              <q-tooltip>
              Score distribution for all students vs mine
              </q-tooltip>
            </span>
          </p>
          <Bar :data="examBarData" :options="examBarOptions" />
          <p>Per question
            <span class="info-icon">
              <q-icon name="info_outline" />
              <q-tooltip>
                My score vs average score for each question
              </q-tooltip>
            </span>
          </p>
          <!-- @vue-ignore -->
          <Bar :data="questionLineBarData" :options="questionLineBarOptions" />
        </div>
        <div class="exam-leaderboard-wrapper">
          <div class="exam-doughnuts">
            <div class="doughnut-info">
              <h3>Rank</h3>
              <p><b>#{{ examInfo?.rank }}</b> /{{ examInfo?.maxRank }}</p>
              <div class="doughnut-box">
                <div class="doughnut-wrapper">
                  <Doughnut :data="examRankData" :options="examRankOptions" />
                  <span>{{ Math.round(examInfo?.percentileRank)}}%</span>
                </div>
              </div>
            </div>
            <div class="doughnut-info">
              <h3>Score</h3>
              <p><b>{{ examInfo?.winnedscore }}</b> /{{ examInfo?.maxwinnablescore }}</p>
              <div class="doughnut-box">
                <div class="doughnut-wrapper">
                  <Doughnut :data="examScoreData" :options="examScoreOptions" />
                  <span>{{ Math.round(examInfo?.score) }}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="exam-leaderboard">
            <h2>Leaderboard </h2>
            <!-- @vue-ignore -->
            <q-table
              flat
              :rows="examLeaderboardRow"
              :columns="examLeaderboardColumn"
              row-key="name"
              hide-bottom
              :pagination="examLeaderboardPagination"
              :visible-columns="visibleLeaderboardColumns"
            >
              <template v-slot:body-cell="props">
                <q-td
                  :props="props"
                  :class="[(props.row.id === 55) ? 'my-spot' : '', (props.row.id === null) ? 'no-row' : '']"
                >
                  <template v-if="props.col.field === 'rank'">
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
                  </template>
                  <template v-else>
                    {{ props.value }}
                  </template>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </div>
    <div class="card-wrapper">
      <div class="all-time-exams">
        <h2>All times (exams) statistics: </h2>
      </div>
      <div class="all-time-exams">
        <div class="exam-graphs">
          <p>Overalll score distribution
            <span class="info-icon">
              <q-icon name="info_outline" />
              <q-tooltip>
              Score distribution across all tests in the course
              </q-tooltip>
            </span>
          </p>
          <Bar :data="allExamBarData" :options="allExamBarOptions" />
        </div>
        <div class="exam-graphs">
          <p>Average test score
            <span class="info-icon">
              <q-icon name="info_outline" />
              <q-tooltip>
              My score vs average score for each test
              </q-tooltip>
            </span>
          </p>
          <!-- @vue-ignore -->
          <Bar :data="allQuestionLineBarData" :options="allQuestionLineBarOptions" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup props="props">
import { computed, onMounted, ref, watchEffect } from 'vue';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Doughnut, Bar } from 'vue-chartjs';
import axios from 'axios';

ChartJS.register(...registerables)

const props = defineProps({
  yearSelected: String,
  courseSelected: String
});

let mainInfo = ref({
  rank: 0,
  percentileRank: 0,
  maxRank: 0,
  attendedtests: 0,
  heldtests: 90,
  minscore: 0,
  maxscore: 0,
  avgscore: 0,
  winnedscore: 0,
  maxwinnablescore: 0,
  score: 0
});

let examInfo = ref({
  rank: 0,
  percentileRank: 0,
  maxRank: 0,
  attendedtests: 0,
  heldtests: 90,
  minscore: 0,
  maxscore: 0,
  avgscore: 0,
  winnedscore: 0,
  maxwinnablescore: 0,
  score: 0
});

interface Leaderboard {
  id_student: number,
  score_perc: string,
  winnedscore: string,
  maxwinnablescore: string
}
let leaderboardInfo = ref<Leaderboard[]>([])

let examAllStudentsDistribution = ref(<{x: number, y: number}[]>[])
let courseAllStudentsDistribution = ref(<{x: number, y: number}[]>[])

let studentTimeQuestionScore = ref(<{x: number, y: number, y2: number, y3: number}[]>[])
let studentTimeAllQuestions = ref(<{x: number, n: number, y: number, y2: number, y3: number}[]>[])

const availableExams = ref<{name: string, value: number}[]>([]);
const examSelected = ref<{name: string, value: number}>();

const calculatePercentage = (percentage: number) => {
  return [percentage, 100 - percentage]
}

const getColorForPercentage = function (pct: number) {
  var percentColors = [
    { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } },
  ];

  pct = pct / 100;
  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
};

const getBarChartWithColor = (score: number) => {
  let data = []
  for (let i = 0; i < 21; i++) {
    if (score === 100 && i == 20) {
      data.push(getColorForPercentage(score));
    } else if (score >= i * 5 && score < (i + 1) * 5) {
      data.push(getColorForPercentage(score));
    } else {
      data.push('#3092df80');
    }
  }
  return data
}

const getLinebarColor = (inputData: {x: number, n?:number, y: number, y2: number, y3: number}[]) => {
  let result = [], i = 0
  for (i=0; i < inputData.length; i++) {
    if(Number(inputData[i].y) > Number(inputData[i].y3)){
      result.push('rgb(127,255,0)')
    } else {
      result.push('#ff3300')
    }
  }
  return result
}

const getLinebarAllTimeColor = (inputData: {x: number, n:number, y: number, y2: number, y3: number}[]) => {
  let result = [], i = 0
  for (i=0; i < inputData.length; i++) {
    if(Number(inputData[i].y) > Number(inputData[i].y2)){
      result.push('rgb(127,255,0)')
    } else {
      result.push('#ff3300')
    }
  }
  return result
}

const calculateRankInPercentage = (inputData: {x: number, n:number, y: number, y2: number, y3: number}[]) => {
  let result = []
  let i = 0
  for (i=0; i < inputData.length; i++) {
    const percentage = (mainInfo?.value.maxRank - inputData[i].y3) / mainInfo?.value.maxRank;
    result.push(Math.round(100 * percentage));
  }
  return result
}

const examLeaderboardColumn = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    required: true,
    align: 'left',
    sortable: false
  },
  { name: 'score', label: 'Score', field: 'score', required: true, align: 'center', sortable: false },
  { name: 'rank', label: 'Rank', field: 'rank', required: true, align: 'center', sortable: false },
  { name: 'examRank', label: '#', field: 'examRank', required: true, align: 'right', sortable: false }
]

interface LeaderbordTable {
  id: number | null,
  name: string | null,
  score: string | null,
  rank: number | null,
  examRank: number | null,
}

const examLeaderboardRow = ref<LeaderbordTable[]>([])

const mapLeaderboardData = () => {
  if(allStudents.value.length && leaderboardInfo.value.length) {
    examLeaderboardRow.value = []
    leaderboardInfo.value.forEach((e, index: number) => {
      const selectedStudent = allStudents.value.find((student: {id: number, name: string, rank_icon: number }) => student.id === e.id_student)
      if(e.winnedscore && examLeaderboardRow.value.length < 5) {
        examLeaderboardRow.value.push({
          id: Number(selectedStudent?.id_student ?? 0),
          name: selectedStudent.name,
          score: Number(leaderboardInfo.value.find(leadInfo => leadInfo.id_student === e.id_student)?.winnedscore).toFixed(2) ?? '0',
          rank: Number(selectedStudent.rank_icon),
          examRank: index+1,
        })
      }
    })
    if(!examLeaderboardRow.value.find(e => e.id === 7726)?.id) {
      examLeaderboardRow.value.push({
        id: null,
        name: '...',
        score: null,
        rank: null,
        examRank: null,
      })

      examLeaderboardRow.value.push({
        id: 7726,
        name: allStudents.value.find((student: {id: number, name: string, rank_icon: number }) => student.id == 7726).name,
        score: Number(leaderboardInfo.value.find((e)=> e.id_student === 7726)?.winnedscore).toFixed(2) ?? '0',
        rank: allStudents.value.find((student: {id: number, name: string, rank_icon: number }) => student.id == 7726).rank_icon,
        examRank: leaderboardInfo.value.findIndex((student) => student.id_student == 7726),
      })
    }
  }
}

const fetchLeaderboardData = (academicYear: number, courseId: number, testId: number) => {
  axios.get(`/api/analytics/leaderboard?academicYear=${academicYear}&courseId=${courseId}&testId=${testId}`)
    .then(response => {
      leaderboardInfo.value = response.data
      mapLeaderboardData()
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchExamData = (academicYear: number, courseId: number, testId: number, studentId: number) => {
  axios.get(`/api/analytics/score?academicYear=${academicYear}&courseId=${courseId}&testId=${testId}&studentId=${studentId}`)
    .then(response => {
      if(testId === 0) {
        mainInfo.value = response.data;
      } else {
        examInfo.value = response.data;
        fetchLeaderboardData(academicYear, courseId, testId)
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchAllStudentsData = (academicYear: number, courseId: number, resolution: number, testId: number) => {
  axios.get(`/api/analytics/total?academicYear=${academicYear}&courseId=${courseId}&onlyScored=true&resolution=${resolution}&testId=${testId}`)
    .then(response => {
      if(testId === 0) {
        courseAllStudentsDistribution.value = response.data.data;
      } else {
        examAllStudentsDistribution.value = response.data.data;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchTimeQuestion = (academicYear: number, courseId: number, testId: number, studentId: number) => {
  axios.get(`/api/analytics/timeQuestion?academicYear=${academicYear}&courseId=${courseId}&testId=${testId}&studentId=${studentId}`)
    .then(response => {
      studentTimeQuestionScore.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchAllTime = (academicYear: number, courseId: number, studentId: number) => {
  axios.get(`/api/analytics/time?academicYear=${academicYear}&courseId=${courseId}&studentId=${studentId}`)
    .then(response => {
      studentTimeAllQuestions.value = response.data;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchExamsForCourse = () => {
  const academicYear = Number(props?.yearSelected?.split('/')[0])
  const courseId = Number(props?.courseSelected) || 0
  const studentId = 7726
  axios.get(`/api/exams?academicYear=${academicYear}&courseId=${courseId}&studentId=${studentId}`)
    .then(response => {
      availableExams.value = response.data.map((exam: { name: string, value: number }) => {
        return {
          label: exam.name,
          value: exam.value
        };
      });

      examSelected.value = availableExams.value[0]

      fetchExamData(Number(props?.yearSelected?.split('/')[0]), Number(props?.courseSelected) || 0, examSelected.value?.value, 7726)
      fetchAllStudentsData(Number(props?.yearSelected?.split('/')[0]), Number(props?.courseSelected) || 0, 5, examSelected.value?.value)
      fetchTimeQuestion(Number(props?.yearSelected?.split('/')[0]), Number(props?.courseSelected) || 0, examSelected.value?.value, 7726)
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const getDataForSelectedExam = () => {
  fetchExamData(Number(props?.yearSelected?.split('/')[0]), Number(props?.courseSelected) || 0, examSelected.value?.value ?? 0, 7726)
  fetchAllStudentsData(Number(props?.yearSelected?.split('/')[0]), Number(props?.courseSelected) || 0, 5, examSelected.value?.value ?? 0)
  fetchTimeQuestion(Number(props?.yearSelected?.split('/')[0]), Number(props?.courseSelected) || 0, examSelected.value?.value ?? 0, 7726)
}



interface AllRanksInterface {
  id_student: number,
  first_name: string,
  last_name: string,
  rank: string,
  percent_rank: number
  score: number
  attendedtests: number
}

const rankNames = ['Junior 1', 'Junior 2', 'Junior 3', 'Mid 1', 'Mid 2', 'Senior', 'Lead'];
const rankPercentages = [15, 15, 15, 20, 20, 13, 2];

const allStudents = ref()

const assignRank = (students: AllRanksInterface[]) => {
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

  const flattenedRanks = ranks.flat();

  allStudents.value = flattenedRanks.reverse();

  return flattenedRanks;
}

const fetchAlLRanks = () => {
  const academicYear = Number(props?.yearSelected?.split('/')[0])
  const courseId = Number(props?.courseSelected) || 0
  axios.get(`/api/analytics/all-ranks?academicYear=${academicYear}&courseId=${courseId}`)
    .then(response => {
      allStudents.value = response.data.map((e: AllRanksInterface) => {
        return {
          id: e.id_student,
          name: e.first_name + ' ' + e.last_name,
          rank: e.rank,
          percentRank: e.percent_rank.toFixed(4),
          score: e.score,
          attendedtests: e.attendedtests,
          rank_icon: e.rank
        }
      })
      assignRank(allStudents.value)
      mapLeaderboardData()
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchData = () => {
  fetchExamData(Number(props?.yearSelected?.split('/')[0]), Number(props?.courseSelected) || 0, 0, 7726)
  fetchExamData(Number(props?.yearSelected?.split('/')[0]), Number(props?.courseSelected) || 0, 14298, 7726)

  fetchAllStudentsData(Number(props?.yearSelected?.split('/')[0]), Number(props?.courseSelected) || 0, 5, 0)

  fetchAllTime(Number(props?.yearSelected?.split('/')[0]), Number(props?.courseSelected) || 0, 7726)

  fetchExamsForCourse()

  fetchAlLRanks()
}

onMounted(fetchData)

watchEffect(() => fetchData())

const percentileData = computed( () => {
  return {
    datasets: [{
      label: 'My First Dataset',
      data: calculatePercentage(mainInfo.value?.percentileRank),
      backgroundColor: [
        getColorForPercentage(mainInfo.value?.percentileRank),
        '#F0F0F0',
      ],
      hoverOffset: 4
    }]
  };
})

const percentileOptions = computed(() => ({
  responsive: true,
  cutout: '65%',
  plugins: {
    tooltip: {
      enabled: false
    }
  }
}));

const scorePercentageData = computed(() => ({
  datasets: [{
    label: 'My First Dataset',
    data: calculatePercentage((mainInfo?.value.winnedscore / mainInfo?.value.maxwinnablescore) * 100),
    backgroundColor: [
      getColorForPercentage((mainInfo?.value.winnedscore / mainInfo?.value.maxwinnablescore) * 100),
      '#F0F0F0',
    ],
    hoverOffset: 4
  }]
}));

const scorePercentageOptions = computed(() => ({
  responsive: true,
  cutout: '65%',
  plugins: {
    tooltip: {
      enabled: false
    }
  }
}));

const scoreAttemptedData = computed(() => ({
  datasets: [{
    label: 'My First Dataset',
    data: calculatePercentage(mainInfo?.value.score),
    backgroundColor: [
      getColorForPercentage(mainInfo?.value.score),
      '#F0F0F0',
    ],
    hoverOffset: 4
  }]
}));

const scoreAttemptedOptions = computed(() => ({
  responsive: true,
  cutout: '65%',
  plugins: {
    tooltip: {
      enabled: false
    }
  }
}));

const minScoreData = computed(() => ({
  datasets: [{
    label: 'My First Dataset',
    data: calculatePercentage(mainInfo?.value.minscore),
    backgroundColor: [
      getColorForPercentage(mainInfo?.value.minscore),
      '#F0F0F0',
    ],
    hoverOffset: 4
  }]
}));

const minScoreOptions = computed(() => ({
  responsive: true,
  cutout: '65%',
  plugins: {
    tooltip: {
      enabled: false
    }
  }
}));

const maxScoreData = computed(() => ({
  datasets: [{
    label: 'My First Dataset',
    data: calculatePercentage(mainInfo?.value.maxscore),
    backgroundColor: [
      getColorForPercentage(mainInfo?.value.maxscore),
      '#F0F0F0',
    ],
    hoverOffset: 4
  }]
}));

const maxScoreOptions = computed(() => ({
  responsive: true,
  cutout: '65%',
  plugins: {
    tooltip: {
      enabled: false
    }
  }
}));

const avgScoreData = computed(() => ({
  datasets: [{
    label: 'My First Dataset',
    data: calculatePercentage(mainInfo?.value.avgscore),
    backgroundColor: [
      getColorForPercentage(mainInfo?.value.avgscore),
      '#F0F0F0',
    ],
    hoverOffset: 4
  }]
}));

const avgScoreOptions = computed(() => ({
  responsive: true,
  cutout: '65%',
  plugins: {
    tooltip: {
      enabled: false
    }
  }
}));

const examRankData = computed(() => ({
  datasets: [{
    label: 'My First Dataset',
    data: calculatePercentage(examInfo?.value.percentileRank),
    backgroundColor: [
      getColorForPercentage(examInfo?.value.percentileRank),
      '#F0F0F0',
    ],
    hoverOffset: 4
  }]
}));

const examRankOptions = computed(() => ({
  responsive: true,
  cutout: '65%',
  plugins: {
    tooltip: {
      enabled: false
    }
  }
}));

const examScoreData = computed(() => ({
  datasets: [{
    label: 'My First Dataset',
    data: calculatePercentage(examInfo?.value.score),
    backgroundColor: [
      getColorForPercentage(examInfo?.value.score),
      '#F0F0F0',
    ],
    hoverOffset: 4
  }]
}));

const examScoreOptions = computed(() => ({
  responsive: true,
  cutout: '65%',
  plugins: {
    tooltip: {
      enabled: false
    }
  }
}));

const examBarData = computed(() => ({
  labels: examAllStudentsDistribution?.value.map(e => e.x),
  datasets: [{
    data: examAllStudentsDistribution?.value.map(e => e.y),
    backgroundColor: getBarChartWithColor(examInfo?.value.score),
    hoverBackgroundColor: getBarChartWithColor(examInfo?.value.score)
  }],
}));

let examBarOptions = ref({
  responsive: true,
  scales: {
    y: {
      title: { display: true, text: '# of students' },
      beginAtZero: true
    },
    x: {
      title: { display: true, text: 'score %' },
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { title: function() { return null; } }
    }
  }
});

const visibleLeaderboardColumns = ref([
  'name',
  'score',
  'rank',
  'examRank'
]);

const examLeaderboardPagination = ref({
  rowsPerPage: 7
});

const questionLineBarData = computed(() => ({
  type: 'bar',
  labels: studentTimeQuestionScore?.value.map(e => e.x),
  datasets: [{
    type: 'bar',
    label: 'My score',
    data: studentTimeQuestionScore?.value.map(e => e.y),
    backgroundColor: getLinebarColor(studentTimeQuestionScore?.value),
    order: 2
  }, {
    type: 'line',
    label: 'Avg score (same ordinal)',
    data: studentTimeQuestionScore?.value.map(e => e.y2),
    backgroundColor: '#3092df',
    borderColor: '#3092df',
    order: 1
  }, {
    type: 'line',
    label: 'Avg score (same question)',
    data: studentTimeQuestionScore?.value.map(e => e.y3),
    backgroundColor: '#333',
    borderColor: '#333',
    order: 1
  }]
}));

const questionLineBarOptions = computed(() => ({
  responsive: true,
  scales: {
    y: {
      title: { display: true, text: 'Score (points)' },
      beginAtZero: true
    },
    x: {
      title: { display: true, text: 'Question' },
    }
  },
  plugins: {
    tooltip: {
      callbacks: { title: function() { return null; } }
    }
  }
}));

const allExamBarData = computed(() => ({
  labels: courseAllStudentsDistribution?.value.map(e => e.x),
  datasets: [{
    data: courseAllStudentsDistribution?.value.map(e => e.y),
    backgroundColor: getBarChartWithColor((mainInfo?.value.winnedscore / mainInfo?.value.maxwinnablescore) * 100),
    hoverBackgroundColor: getBarChartWithColor((mainInfo?.value.winnedscore / mainInfo?.value.maxwinnablescore) * 100),
  }],
}));

let allExamBarOptions = ref({
  responsive: true,
  scales: {
    y: {
      title: { display: true, text: '# of students' },
      beginAtZero: true
    },
    x: {
      title: { display: true, text: 'score %' },
    }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { title: function() { return null } }
    }
  }
});

const allQuestionLineBarData = computed(() => ({
  labels: studentTimeAllQuestions?.value.map(e => e.x),
  datasets: [{
    type: 'bar',
    label: 'My score',
    data: studentTimeAllQuestions?.value.map(e => e.y),
    backgroundColor: getLinebarAllTimeColor(studentTimeAllQuestions?.value),
    order: 2
  }, {
    type: 'line',
    label: 'Avg score',
    data: studentTimeAllQuestions?.value.map(e => e.y2),
    backgroundColor: '#3092df',
    borderColor: '#3092df',
    order: 1
  }, {
    type: 'line',
    label: 'Rank',
    data: calculateRankInPercentage(studentTimeAllQuestions?.value),
    backgroundColor: '#333',
    borderColor: '#333',
    order: 1
  }]
}));

let allQuestionLineBarOptions = computed(() => ({
  responsive: true,
  scales: {
    y: {
      title: { display: true, text: '# of students' },
      beginAtZero: true
    },
    x: {
      title: { display: true, text: 'score %' },
    }
  },
  plugins: {
    tooltip: {
      callbacks: { title: function() { return null; },
        label: function(e: {dataset: {data: number[]}}, i: number) {
          return e.dataset.data[i];
        }}
    }
  }
}));


</script>

