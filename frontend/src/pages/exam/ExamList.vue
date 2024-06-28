<template>
  <div class="list-wrapper">
    <div class="card-wrapper exams-ready relative-position">
      <div
        class="exams-awards"
        v-if="rank"
      >
        <img width="25px" :src="'/img/rank' + rank + '.png'" alt="">
      </div>
      <h2>Exams taken</h2>
      <!-- @vue-ignore -->
      <q-table
        flat
        :rows="examRows"
        :columns="columns"
        row-key="name"
        :pagination="initialPagination"
        @row-click="onRowClick"
        :visible-columns="visibleColumns"
      >
        <template v-slot:body-cell-ignored="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.ignored" color="positive" name="check" />
              <q-icon v-if="!props.row.ignored" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-passed="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.passed" color="positive" name="check" />
              <q-icon v-if="!props.row.passed" color="negative" name="close" />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="card-wrapper exams-ready relative-position">
      <div
        class="exams-awards"
        v-if="exerciseRows.length"
      >
        <p><b>{{ exerciseRows.length }}</b>x</p>
        <img src="~assets/trophy-icon.png">
      </div>
      <h2>Exercise taken</h2>
      <!-- @vue-ignore -->
      <q-table
        flat
        :rows="exerciseRows"
        :columns="columns"
        row-key="name"
        :pagination="initialPagination"
        @row-click="onRowClick"
        :visible-columns="visibleColumns"
      >
        <template v-slot:body-cell-ignored="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.ignored" color="positive" name="check" />
              <q-icon v-if="!props.row.ignored" color="negative" name="close" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-passed="props">
          <q-td :props="props">
            <div class="checkmark-cell">
              <q-icon v-if="props.row.passed" color="positive" name="check" />
              <q-icon v-if="!props.row.passed" color="negative" name="close" />
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script lang="ts" setup props="props">
import { useRouter } from 'vue-router';
import { onMounted, ref, watchEffect } from 'vue';
import axios from 'axios';

const props = defineProps({
  yearSelected: String,
  courseSelected: String,
  rank: Number
});

const columns = ref([
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
    sortable: true,
  },
  {
    name: 'ignored',
    align: 'center',
    label: 'Score ignored',
    field: 'ignored',
    sortable: true,
  },
  { name: 'started', label: 'Started', field: 'started', sortable: true },
  { name: 'submitted', label: 'Submitted', field: 'submitted' },
  { name: 'duration', label: 'Duration', field: 'duration' },
  {
    name: 'score',
    label: 'Score',
    field: 'score',
    sortable: true,
  },
  {
    name: 'score_p',
    label: 'Score %',
    field: 'score_p',
    sortable: true,
  },
  {
    name: 'passed',
    label: 'Passed',
    field: 'passed',
    sortable: true,
  },
])

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


const examRows = ref([]);
const exerciseRows = ref([]);

const router = useRouter();
const onRowClick = (evt:string, row:ExamData) => {
  router.push({ path: '/exam/' + row.id });
};

const initialPagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 20,
})

const visibleColumns = ref([
  'name',
  'started',
  'submitted',
  'duration',
  'score',
  'score_p',
  'passed',
])

const fetchExams = () => {
  const academicYear = Number(props?.yearSelected?.split('/')[0])
  const courseId = Number(props?.courseSelected) || 0
  const studentId = 7726
  axios.get(`/api/exams/finished-exams?academicYear=${academicYear}&courseId=${courseId}&studentId=${studentId}`)
    .then(response => {
      examRows.value = response.data.map((exam: ExamResponseData) => {
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
      }).filter((exam: ExamData) => !exam.ignored);

      exerciseRows.value = response.data.map((exam: ExamResponseData) => {
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
}

onMounted(fetchData)

watchEffect(() => fetchData())
</script>
