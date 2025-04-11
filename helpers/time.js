import moment from 'moment';
const helpers = {};

helpers.timeago = timestamp => {
  return moment(timestamp).locale('es').startOf('seconds').fromNow();
}

export default helpers;