import formurlencoded from 'form-urlencoded'
import cookie from 'tiny-cookie'
const REFRESH_TOKEN_INTERVAL = 30000


export function getReadableDate(timestamp) {
  let timeDate = new Date(timestamp),
      timeNowDate = new Date(),
      num2week = ['一', '二', '三', '四', '五', '六', '日'],
      time = {
        year: timeDate.getFullYear(),
        month: timeDate.getMonth() + 1,
        date: timeDate.getDate(),
        day: num2week[timeDate.getDay()],
        hour: timeDate.getHours() >= 10 ? timeDate.getHours() : `0${timeDate.getHours()}`,
        minute: timeDate.getMinutes() >= 10 ? timeDate.getMinutes() : `0${timeDate.getMinutes()}`
      },
      timeNow = {
        year: timeNowDate.getFullYear(),
        month: timeNowDate.getMonth() + 1,
        date: timeNowDate.getDate()
      }

  if (timeNow.year !== time.year) {
    return `${time.year}-${time.month}-${time.date} 周${time.day} ${time.hour}:${time.minute}`
  } else if (timeNow.month !== time.month) {
    return `${time.month}-${time.date} 周${time.day} ${time.hour}:${time.minute}`
  } else if (timeNow.date === time.date) {
    return `${time.hour}:${time.minute}`
  } else if (timeNow.date - 1 === time.date) {
    return `昨天 ${time.hour}:${time.minute}`
  } else {
    return `${time.month}-${time.date} 周${time.day} ${time.hour}:${time.minute}`
  }
}

export function myFetch( url, options ) {
  options = Object.assign({}, {
    credentials: 'same-origin',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
  }, options)
  if (options.method === 'POST') {
    options.body = options.body || {}
    options.body.serviceToken = cookie.get('serviceToken')
    options.body = formurlencoded(options.body, {ignorenull: true})
  } else if (options.method === 'GET') {
    options.query._dc = +new Date
    url = `${url}?${ formurlencoded( options.query, { ignorenull : true })}` 
  }
   return fetch(url, options).then(res => {
      let {ok, status} = res
      if (ok) {
        return res.json().then(({code, data, reason}) => {
          if (code === 0) { return data }
          else {
            throw new Error(reason || 'error')
          }
        })
      }
      else if (status === 401) {
        return res.json().then(({D} = {}) => {
          if (D) { 
            loginStep2()
          }
          else loginStep1()
        })
      } else {
        throw new Error('other error')
      }
   })
}


export function getUserID() {
  let uuid = cookie.get('userId')
  if ( !uuid ) {
    loginStep1()
  }else{
    return uuid
  }
}
function loginStep1() {
  let isDaily = location.hostname.indexOf('daily.') > -1;
  const DAILY_URL = 'https://account.xiaomi.com/pass/serviceLogin?callback=https%3A%2F%2Fi.mi.com%2Fsts%3Fsign%3D14MSbe0BrJOrrqWmiDYjrKwkIkU%253D%26followup%3Dhttp%253A%252F%252Fdaily.i.mi.com%252Fmobile%252Fsms%252Ftrash&sid=i.mi.com&_bal=true';
  // const PROD_URL = 'https://account.xiaomi.com/pass/serviceLogin?callback=https%3A%2F%2Fi.mi.com%2Fsts%3Fsign%3DHfKWXC1KhUxS9I6M8RbZLr%252BoAv8%253D%26followup%3Dhttps%253A%252F%252Fi.mi.com%252Fmobile%252Fcontact%252Ftrash&sid=i.mi.com&_bal=true';
  location = isDaily ? DAILY_URL : PROD_URL;
}
  //是否check phone
function loginStep2() {
  let isDaily = location.hostname.indexOf('daily.') > -1;
  const DAILY_URL = 'https://account.xiaomi.com/pass/serviceLogin?callback=https%3A%2F%2Fi.mi.com%2Fsts%3Fsign%3D14MSbe0BrJOrrqWmiDYjrKwkIkU%253D%26followup%3Dhttp%253A%252F%252Fdaily.i.mi.com%252Fmobile%252Fsms%252Ftrash&sid=i.mi.com&_bal=true&checkSafePhone=true';
  // const PROD_URL = 'https://account.xiaomi.com/pass/serviceLogin?callback=https%3A%2F%2Fi.mi.com%2Fsts%3Fsign%3DHfKWXC1KhUxS9I6M8RbZLr%252BoAv8%253D%26followup%3Dhttps%253A%252F%252Fi.mi.com%252Fmobile%252Fcontact%252Ftrash&sid=i.mi.com&_bal=true&checkSafePhone=true';
  location = isDaily ? DAILY_URL : PROD_URL;
}



export function refreshToken() {
  let userId = cookie.get('userId')
  let url = `/status/${userId}/lite/setting`
  const options = {
    method : 'GET',
    query : {
      type: 'AutoRenewal',
      inactiveTime: 10,
      _dc: new Date().getTime()
    }
  }
  return fetch(url, options).then((res) => setTimeout(refreshToken, REFRESH_TOKEN_INTERVAL));
}

