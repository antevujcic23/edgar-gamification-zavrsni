<template>
  <div class="list-wrapper">
    <div class="inline-card-wrapper">
      <div class="card-wrapper flex column">
        <div class="quote-wrapper">
          <p class="quote">{{ 'Today is your opportunity to build the tomorrow you want.' }}</p>
          <p class="author">- {{ 'Ken Poirot' }}</p>
        </div>
        <div class="new-exam-start">
          <q-input outlined v-model="text" placeholder="Password..."/>
          <div class="q-pa-sm q-gutter-sm">
            <q-btn to="/start" label="Start" outline color="green" />
          </div>
        </div>
      </div>
      <div class="card-wrapper awards-info">
        <div class="single-award" v-if="rank">
          <p>{{ ranks[ rank - 1] }}</p>
          <img width="70px" :src="'/img/rank' + rank + '.png'" alt="">
        </div>
        <div class="single-award">
          <p><b>{{ passedExerciseRows.length + exerciseRowsSubmitted }}</b> / {{ passedExerciseRows.length + exerciseRows.length }}</p>
          <img src="~assets/trophy-icon.png">
        </div>
        <div class="single-award">
          <p><b>{{ tutorialsPassed }}</b> / {{ tutorialRows.length }}</p>
          <img src="~assets/achievement-award-medal-icon.png">
        </div>
      </div>
    </div>
    <div class="card-wrapper exams-ready">
      <h2>Exams</h2>
      <div v-if="examRows.length">
      <!-- @vue-ignore -->
      <q-table
        flat
        :rows="examRows"
        :columns="columns"
        row-key="index"
        :visible-columns="visibleColumns"
        hide-bottom
        :pagination="initialPagination"
      >
        <template v-slot:body-cell-scoreIgnored="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.scoreIgnored" color="positive" name="check" />
              <q-icon v-if="!props.row.scoreIgnored" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-forward="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.forward" color="positive" name="check" />
              <q-icon v-if="!props.row.forward" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-stats="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.stats" color="positive" name="check" />
              <q-icon v-if="!props.row.stats" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-global="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.global" color="positive" name="check" />
              <q-icon v-if="!props.row.global" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-public="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.public" color="positive" name="check" />
              <q-icon v-if="!props.row.public" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-start="props">
          <q-td :props="props" class="start-button">
          <div class="q-pa-sm q-gutter-sm">
            <q-btn to="/start" label="Start" outline color="green" />
          </div>
          </q-td>
        </template>
      </q-table>
      </div>
      <p class="no-tests" v-else>There are currently no Exams open</p>
    </div>

    <div class="card-wrapper exams-ready relative-position">
      <h2>Exercise</h2>
      <div v-if="exerciseRows.length">
      <!-- @vue-ignore -->
      <q-table
        flat
        :rows="exerciseRows"
        :columns="columns"
        row-key="index"
        :visible-columns="visibleColumns"
        hide-bottom
        :pagination="initialPagination"
      >
        <template v-slot:body-cell-scoreIgnored="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.scoreIgnored" color="positive" name="check" />
              <q-icon v-if="!props.row.scoreIgnored" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-forward="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.forward" color="positive" name="check" />
              <q-icon v-if="!props.row.forward" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-stats="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.stats" color="positive" name="check" />
              <q-icon v-if="!props.row.stats" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-global="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.global" color="positive" name="check" />
              <q-icon v-if="!props.row.global" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-public="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.public" color="positive" name="check" />
              <q-icon v-if="!props.row.public" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-start="props">
          <q-td :props="props" class="start-button">
            <div class="q-pa-sm q-gutter-sm">
              <q-btn to="/start" label="Start" outline color="green" />
            </div>
          </q-td>
        </template>
      </q-table>
      </div>
      <p class="no-tests" v-else>There are currently no Exercises open</p>
    </div>

    <div class="card-wrapper exams-ready relative-position">
      <div
        class="exams-awards"
        v-if="tutorialsPassed"
      >
        <p><b>{{ tutorialsPassed }}</b> / {{ tutorialRows.length }}</p>
        <img src="~assets/achievement-award-medal-icon.png">
      </div>
      <h2>Tutorials</h2>
      <div v-if="tutorialRows.length">
      <!-- @vue-ignore -->
      <q-table
        flat
        :rows="tutorialRows"
        :columns="tutorialColumns"
        row-key="index"
        :visible-columns="visibleTutorialColumns"
        hide-bottom
        :pagination="initialPagination"
      >
        <template v-slot:body-cell-finished="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.finished" color="positive" name="check" />
              <q-icon v-if="!props.row.finished" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-start="props">
          <q-td :props="props" class="start-button">
            <div class="q-pa-sm q-gutter-sm">
              <q-btn to="/start" label="Start" outline color="green" />
            </div>
          </q-td>
        </template>
      </q-table>
      </div>
      <p class="no-tests" v-else>There are currently no Tutorials open</p>
    </div>
  </div>
</template>

<script lang="ts" setup props="props">
import { onMounted, ref, watchEffect } from 'vue';
import axios from 'axios';

const props = defineProps({
  yearSelected: String,
  courseSelected: String,
  rank: Number
});

const text = ref()

const initialPagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
})

const columns = ref([
  {
    name: 'id',
  },
  {
    name: 'academicYear',
    required: true,
    label: 'Academic year',
    align: 'left',
    field: 'academicYear',
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row: ExamData) => row.name,
    format: (val: string) => `${val}`,
  },
  {
    name: 'runs',
    align: 'right',
    label: 'Runs/Max',
    field: 'runs',
  },
  { name: 'duration', label: 'Duration', field: 'duration' },
  { name: 'scoreIgnored', label: 'Score Ignored', field: 'scoreIgnored' },
  { name: 'forward', label: 'Forward only', field: 'forward' },
  {
    name: 'stats',
    label: 'Used in stats',
    field: 'stats',
  },
  {
    name: 'global',
    label: 'Global',
    field: 'global',
  },
  {
    name: 'public',
    label: 'Public',
    field: 'public',
  },
  {
    name: 'available',
    label: 'Available',
    field: 'available',
  },
  {
    name: 'start',
    label: 'Start exam',
    field: 'start',
  },
])

const tutorialColumns = ref([
  {
    name: 'id',
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row: ExamData) => row.name,
    format: (val: string) => `${val}`,
  },
  {
    name: 'description',
    align: 'left',
    label: 'Description',
    field: 'description',
  },
  { name: 'steps', label: 'Steps', field: 'steps' },
  { name: 'finished', label: 'Finished', field: 'finished' },
  { name: 'finished_at', label: 'Finished at', field: 'finished_at' },
  {
    name: 'start',
    label: 'Start exam',
    field: 'start',
  },
])

interface ExamData {
  name: string,
  started: string,
  submitted: string,
  duration: string,
  score: number,
  score_p: string,
  passed: boolean,
}

interface ExamResponseData {
  ac_year: string;
  title: string;
  max_runs: number;
  questions_no: number;
  duration_seconds: number;
  test_score_ignored: boolean;
  forward_only: boolean;
  use_in_stats: boolean;
  is_global: boolean;
  is_public: boolean;
  password: string;
  seconds_available_to: string;
  ts_available_to: string;
  no_started: string;
  no_submitted: string;
}

interface TutorialResponseData {
  id: number;
  tutorial_title: string;
  is_active: boolean;
  tutorial_desc: string;
  ts_finished: string;
  finished: string;
  courses: string;
  no_steps: number;
}

const examRows = ref([]);
const exerciseRows = ref([]);
const passedExerciseRows = ref([]);
const tutorialRows = ref<{
  name: string,
  description: string,
  steps: string,
  finished: string,
  finished_at: string,
}[]>([]);
const tutorialsPassed = ref<number>(0)

const visibleTutorialColumns = ref([
  'name',
  'description',
  'steps',
  'finished',
  'finished_at',
  'start'
])

const visibleColumns = ref([
  'academicYear',
  'name',
  'runs',
  'duration',
  'forward',
  'stats',
  'global',
  'public',
  'available',
  'run',
  'start'
])

const ranks = [
  'Junior 1',
  'Junior 2',
  'Junior 3',
  'Mid 1',
  'Mid 1',
  'Senior',
  'Lead'
]
const exerciseRowsSubmitted = ref<number>(0)

const fetchExams = () => {
  const courseId = Number(props?.courseSelected) || 0
  const studentId = 7726
  axios.get(`/api/exams/open-exams?courseId=${courseId}&studentId=${studentId}`)
    .then(response => {
      examRows.value = response.data.map((exam: ExamResponseData) => {
        return {
          academicYear: exam.ac_year,
          name: exam.title,
          runs:  (exam.no_started + '/' + exam.max_runs),
          duration: new Date(exam.duration_seconds * 1000).toISOString().substring(11, 16),
          scoreIgnored: exam.test_score_ignored,
          forward: exam.forward_only,
          stats: exam.use_in_stats,
          global: exam.is_global,
          public: exam.is_public,
          available: exam.ts_available_to,
        };
      }).filter((exam: ExamResponseData) => exam.test_score_ignored);

      exerciseRowsSubmitted.value = 0

      exerciseRows.value = response.data.map((exam: ExamResponseData) => {
        if(exam.test_score_ignored && Number(exam.no_started) > 0) {
          exerciseRowsSubmitted.value = exerciseRowsSubmitted.value + 1
        }

        return {
          academicYear: exam.ac_year,
          name: exam.title,
          runs:  (exam.no_started + '/' + exam.max_runs),
          duration: new Date(exam.duration_seconds * 1000).toISOString().substring(11, 16),
          scoreIgnored: exam.test_score_ignored,
          forward: exam.forward_only,
          stats: exam.use_in_stats,
          global: exam.is_global,
          public: exam.is_public,
          available: exam.ts_available_to,
        };
      }).filter((exam: ExamResponseData) => !exam.test_score_ignored);

    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchTutorials = () => {
  const courseId = Number(props?.courseSelected) || 0
  const studentId = 7726
  axios.get(`/api/exams/open-tutorials?courseId=${courseId}&studentId=${studentId}`)
    .then(response => {
      tutorialsPassed.value = 0
      let temp = response.data.map((exam: TutorialResponseData) => {
        if (exam.finished !== 'No') tutorialsPassed.value++
        return {
          name: exam.tutorial_title,
          description: exam.tutorial_desc,
          steps: exam.no_steps,
          finished: exam.finished !== 'No',
          finished_at: exam.ts_finished ?? '-',
        };
      });

      tutorialRows.value = temp
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

interface ExamResponseData {
  title: string;
  test_score_ignored: boolean;
  tosort: string;
  ts_started: string;
  ts_submitted: string;
  duration: string;
  correct_no: number;
  incorrect_no: number;
  unanswered_no: number;
  partial_no: number;
  t_score: string;
  t_score_perc: string;
  passed: boolean;
  id_test_instance: number;
  show_review: boolean;
}
interface ExamData {
  id: number,
  name: string,
  ignored: boolean,
  started: string,
  submitted: string,
  duration: string,
  score: number,
  score_p: string,
  passed: boolean,
}
const fetchPassedExercises = () => {
  const academicYear = Number(props?.yearSelected?.split('/')[0])
  const courseId = Number(props?.courseSelected) || 0
  const studentId = 7726
  axios.get(`/api/exams/finished-exams?academicYear=${academicYear}&courseId=${courseId}&studentId=${studentId}`)
    .then(response => {
      passedExerciseRows.value = response.data.map((exam: ExamResponseData) => {
        return {
          id: exam.id_test_instance,
          name: exam.title,
          ignored: exam.test_score_ignored,
          started: exam.ts_started,
          submitted: exam.ts_submitted,
          duration: exam.duration,
          score: exam.t_score,
          score_p: exam.t_score_perc,
          passed: exam.passed,
          review: exam.show_review
        };
      }).filter((exam: ExamData) => exam.ignored);

    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

const fetchData = () => {
  fetchExams()
  fetchTutorials()
  fetchPassedExercises()
}

onMounted(fetchData)

watchEffect(() => fetchData())
</script>
