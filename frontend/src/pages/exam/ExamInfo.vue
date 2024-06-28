<template>
  <div class="list-wrapper">
    <div class="card-wrapper">
      <div class="exam-title q-table__title">
        <p>{{ rows[0].name }}</p>
        <div class="q-pa-sm q-gutter-sm">
          <q-btn to="/review" label="Review" outline color="green" />
        </div>
      </div>
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">{{ columns[1].label }}</th>
            <th class="text-right">{{ columns[2].label }}</th>
            <th class="text-right">{{ columns[3].label }}</th>
            <th class="text-right">{{ columns[4].label }}</th>
            <th class="text-right">{{ columns[5].label }}</th>
            <th class="text-right">{{ columns[6].label }}</th>
            <th class="text-right">{{ columns[7].label }}</th>
            <th class="text-right">{{ columns[8].label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">{{ rows[0].name }}</td>
            <td class="text-right">
              <div class="checkmark-cell">
                <q-icon v-if="rows[0].ignored" color="positive" name="check" />
                <q-icon v-if="!rows[0].ignored" color="negative" name="close" />
              </div>
            </td>
            <td class="text-right">{{ rows[0].started }}</td>
            <td class="text-right">{{ rows[0].submitted }}</td>
            <td class="text-right">{{ rows[0].duration }}</td>
            <td class="text-right">{{ rows[0].score }}</td>
            <td class="text-right">{{ rows[0].score_p }}</td>
            <td class="text-right">
              <div class="checkmark-cell">
                <q-icon v-if="rows[0].passed" color="positive" name="check" />
                <q-icon v-if="!rows[0].passed" color="negative" name="close" />
              </div>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div class="card-wrapper">
      <q-markup-table separator="cell">
        <thead>
          <tr>
            <th class="text-left">{{ questionColumns[0].label }}</th>
            <th class="text-center">{{ questionColumns[1].label }}</th>
            <th class="text-center">{{ questionColumns[2].label }}</th>
            <th class="text-center">{{ questionColumns[3].label }}</th>
            <th class="text-center">{{ questionColumns[4].label }}</th>
            <th class="text-center">{{ questionColumns[5].label }}</th>
            <th class="text-right">{{ questionColumns[6].label }}</th>
            <th class="text-right">{{ questionColumns[7].label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="questionRow in questionRows" :key="questionRow.question">
            <td class="text-left">{{ questionRow.question }}</td>
            <td class="text-right">
              <div class="checkmark-cell text-center">
                <q-icon
                  v-if="questionRow.correct"
                  color="positive"
                  name="check"
                />
              </div>
            </td>
            <td class="text-right">
              <div class="checkmark-cell text-center">
                <q-icon
                  v-if="questionRow.incorrect"
                  color="negative"
                  name="check"
                />
              </div>
            </td>
            <td class="text-right">
              <div class="checkmark-cell text-center">
                <q-icon v-if="questionRow.partial" color="dark" name="check" />
              </div>
            </td>
            <td class="text-right">
              <div class="checkmark-cell text-center">
                <q-icon
                  v-if="questionRow.unanswered"
                  color="dark"
                  name="check"
                />
              </div>
            </td>
            <td class="text-right">
              <div class="checkmark-cell text-center">
                <q-icon
                  v-if="questionRow.correction"
                  color="dark"
                  name="check"
                />
              </div>
            </td>
            <td class="text-right">{{ questionRow.score }}</td>
            <td class="text-right">{{ questionRow.score_p }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
    <div class="card-wrapper">
      <q-markup-table separator="cell">
        <thead>
          <tr>
            <th class="text-left">{{ logColumns[0].label }}</th>
            <th class="text-left">{{ logColumns[1].label }}</th>
            <th class="text-left">{{ logColumns[2].label }}</th>
            <th class="text-left">{{ logColumns[3].label }}</th>
            <th class="text-left">{{ logColumns[4].label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logRows" :key="log.id">
            <td class="text-left">{{ log.id }}</td>
            <td class="text-left">{{ log.mongo }}</td>
            <td class="text-left">{{ log.client }}</td>
            <td class="text-left">{{ log.name }}</td>
            <td class="text-left">
              <pre><code>{{ log.data }}</code></pre>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
const columns = [
  {
    name: 'id',
  },
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
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
];

const rows = [
  {
    id: 281292,
    name: 'Završni 22/23',
    ignored: false,
    started: '2023-06-26 12:09:11',
    submitted: '2023-06-26 14:39:10',
    duration: '02:29:59',
    score: 15,
    score_p: '50%',
    passed: true,
  },
];

const questionColumns = [
  {
    name: 'question',
    required: true,
    label: '#',
    align: 'left',
  },
  {
    name: 'correct',
    align: 'center',
    label: 'Correct',
    sortable: true,
  },
  {
    name: 'incorrect',
    align: 'center',
    label: 'Incorrect',
    sortable: true,
  },
  {
    name: 'partial',
    align: 'center',
    label: 'Partial',
    sortable: true,
  },
  {
    name: 'unanswered',
    align: 'center',
    label: 'Unanswered',
    sortable: true,
  },
  {
    name: 'correction',
    align: 'center',
    label: 'Correction',
    sortable: true,
  },
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
];

const questionRows = [
  {
    question: 1,
    correct: false,
    incorrect: false,
    partial: true,
    unanswered: false,
    correction: false,
    score: 1.0,
    score_p: '25.0%',
  },
  {
    question: 2,
    correct: false,
    incorrect: false,
    partial: true,
    unanswered: false,
    correction: false,
    score: 1.5,
    score_p: '30.0%',
  },
  {
    question: 3,
    correct: false,
    incorrect: false,
    partial: true,
    unanswered: false,
    correction: false,
    score: 3.0,
    score_p: '75.0%',
  },
  {
    question: 4,
    correct: false,
    incorrect: false,
    partial: true,
    unanswered: false,
    correction: false,
    score: 1.0,
    score_p: '33.3%',
  },
  {
    question: 5,
    correct: false,
    incorrect: false,
    partial: true,
    unanswered: false,
    correction: false,
    score: 3.5,
    score_p: '87.5%',
  },
  {
    question: 6,
    correct: false,
    incorrect: false,
    partial: true,
    unanswered: false,
    correction: false,
    score: 2.5,
    score_p: '35.7%',
  },
  {
    question: 7,
    correct: false,
    incorrect: false,
    partial: true,
    unanswered: false,
    correction: false,
    score: 2.5,
    score_p: '83.3%',
  },
  {
    question: 8,
    correct: true,
    incorrect: false,
    partial: false,
    unanswered: false,
    correction: false,
    score: 0,
    score_p: '100%',
  },
  {
    question: 9,
    correct: true,
    incorrect: false,
    partial: false,
    unanswered: false,
    correction: false,
    score: 0,
    score_p: '100%',
  },
];

const logColumns = [
  {
    name: '#',
    required: true,
    label: '#',
    align: 'left',
  },
  {
    name: 'mongo',
    required: true,
    label: 'Mongo ts',
    align: 'left',
  },
  {
    name: 'client',
    align: 'center',
    label: 'Client ts',
  },
  { name: 'name', label: 'Event name' },
  { name: 'data', label: 'Event data' },
];

const logRows = [
  {
    id: 1,
    mongo: 'Mon Apr 22 2022 10:04:52',
    client: '2023-04-24T10:03:52.252Z	',
    name: 'Get exam',
    data: '-',
  },
  {
    id: 2,
    mongo: 'Mon Apr 22 2022 10:04:52',
    client: '2023-04-24T10:03:52.252Z	',
    name: 'Received exam.',
    data: '{test: oblik, test: {test: dva}}, test: {test: dva}}, test: {test: dva}}, test: {test: dva}}',
  },
  {
    id: 3,
    mongo: 'Mon Apr 22 2022 10:04:52',
    client: '2023-04-24T10:03:52.252Z	',
    name: 'Get question',
    data: 'num: 2',
  },
];

export default {
  setup() {
    const router = useRouter();
    const onRowClick = (evt, row) => {
      router.push({ path: '/exam/' + row.id });
    };
    return {
      columns,
      rows,
      questionRows,
      questionColumns,
      logColumns,
      logRows,
      onRowClick,
    };
  },
};
</script>
