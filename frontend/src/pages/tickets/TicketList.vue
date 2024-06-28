<template>
  <div class="list-wrapper">
    <div class="card-wrapper" v-for="ticket in tickets" :key="ticket.id">
      <q-markup-table>
        <thead>
          <tr>
            <th class="text-left">{{ ticketColumn[0].label }}</th>
            <th class="text-left">{{ ticketColumn[1].label }}</th>
            <th class="text-right">{{ ticketColumn[2].label }}</th>
            <th class="text-right">{{ ticketColumn[3].label }}</th>
            <th class="text-right">{{ ticketColumn[4].label }}</th>
            <th class="text-right">{{ ticketColumn[5].label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">{{ ticket.id }}</td>
            <td class="text-left">{{ ticket.exam }}</td>
            <td class="text-right">{{ ticket.q_num }}</td>
            <td class="text-right">{{ ticket.created }}</td>
            <td class="text-right">{{ ticket.modified }}</td>
            <td class="text-right">
              <q-badge v-if="ticket.status" color="positive" label="Closed" />
              <q-badge v-else color="negative" label="Open" />
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <div class="ticket-wrapper">
                <div
                  class="ticket-message"
                  v-for="message in ticket.description"
                  :key="message.date"
                >
                  <p class="ticket-date">{{ message.date }}</p>
                  <p>{{ message.text }}</p>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
const ticketColumn = [
  {
    name: 'id',
    label: '#',
    align: 'left',
  },
  {
    name: 'exam',
    align: 'left',
    label: 'exam',
  },
  {
    name: 'q_num',
    align: 'left',
    label: 'Q.no.',
  },
  {
    name: 'created',
    align: 'left',
    label: 'Created',
  },
  {
    name: 'modified',
    align: 'left',
    label: 'Last modified',
  },
  {
    name: 'status',
    align: 'left',
    label: 'Status',
  },
];

const tickets = [
  {
    id: 1,
    exam: '3. laboratorijska vježba',
    q_num: 1,
    created: '2023-05-25 19:09:13',
    modified: '2023-05-25 19:13:31',
    status: true,
    description: [
      {
        date: 'Thu May 25 2023 19:09:13 GMT+0200',
        text: 'Što radimo u slučaju da su predana 4/5 file-a? Konkretno nije predan sql file, trebamo li Relacijski sami prevest u sql ili na određena pitanja trebamo dati najmanju ocjenu?',
      },
      {
        date: 'Thu May 25 2023 19:13:31 GMT+0200',
        text: 'Ono što ne možete ocijeniti preko relacijskog modela (npr. ograničenja), ocijenite s 1',
      },
    ],
  },
];

export default {
  setup() {
    const router = useRouter();
    const onRowClick = (evt, row) => {
      router.push({ path: '/exam/' + row.id });
    };
    return { ticketColumn, tickets, onRowClick };
  },
};
</script>
