function dateFormat(date) {

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

}

module.exports = { dateFormat }

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

// class D8 implements Date {

//   token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g
// 	timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g
// 	timezoneClip = /[^-+\dA-Z]/g

//   // Some common format strings
//   masks = {
//     "default":      "ddd mmm dd yyyy HH:MM:ss",
//     shortDate:      "m/d/yy",
//     mediumDate:     "mmm d, yyyy",
//     longDate:       "mmmm d, yyyy",
//     fullDate:       "dddd, mmmm d, yyyy",
//     shortTime:      "h:MM TT",
//     mediumTime:     "h:MM:ss TT",
//     longTime:       "h:MM:ss TT Z",
//     isoDate:        "yyyy-mm-dd",
//     isoTime:        "HH:MM:ss",
//     isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
//     isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
//   }

//   // Regexes and supporting functions are cached through closure
//   constructor(date : string | number | Date | D8, mask? : string, utc? : string) {

//       let d8 = this
  
//       // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
//       if (arguments.length == 1 && date instanceof String && !/\d/.test(date)) {
//         mask = date
//         date = undefined
//       }
  
//       // Passing date through Date applies Date.parse, if necessary
//       date = date ? new Date(date) : new Date
//       if (isNaN(date)) throw SyntaxError("invalid date")
  
//       mask = String(d8.masks[mask] || mask || d8.masks["default"])
  
//       // Allow setting the utc argument via the mask
//       if (mask.slice(0, 4) == "UTC:") {
//         mask = mask.slice(4)
//         utc = true
//       }
  
//       var	_ = utc ? "getUTC" : "get",
//         d = date[_ + "Date"](),
//         D = date[_ + "Day"](),
//         m = date[_ + "Month"](),
//         y = date[_ + "FullYear"](),
//         H = date[_ + "Hours"](),
//         M = date[_ + "Minutes"](),
//         s = date[_ + "Seconds"](),
//         L = date[_ + "Milliseconds"](),
//         o = utc ? 0 : date.getTimezoneOffset(),
//         flags = {
//           d:    d,
//           dd:   pad(d),
//           ddd:  d8.i18n.dayNames[D],
//           dddd: d8.i18n.dayNames[D + 7],
//           m:    m + 1,
//           mm:   pad(m + 1),
//           mmm:  d8.i18n.monthNames[m],
//           mmmm: d8.i18n.monthNames[m + 12],
//           yy:   String(y).slice(2),
//           yyyy: y,
//           h:    H % 12 || 12,
//           hh:   pad(H % 12 || 12),
//           H:    H,
//           HH:   pad(H),
//           M:    M,
//           MM:   pad(M),
//           s:    s,
//           ss:   pad(s),
//           l:    pad(L, 3),
//           L:    pad(L > 99 ? Math.round(L / 10) : L),
//           t:    H < 12 ? "a"  : "p",
//           tt:   H < 12 ? "am" : "pm",
//           T:    H < 12 ? "A"  : "P",
//           TT:   H < 12 ? "AM" : "PM",
//           Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
//           o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
//           S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
//         }
  
//       return mask.replace(token, function ($0) {
//         return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1)
//       })
//     }
//   }
	
//   pad(value : string | number | Date | D8, length? : number) {
//     value = String(value)
//     length = length || 2
//     while (value.length < length) value = "0" + value
//     return value
//   }


//   toString(): string {
//     throw new Error("Method not implemented.")
//   }
  
// 	toDateString(): string {
//     throw new Error("Method not implemented.")
//   }
  
// 	toTimeString(): string {
//     throw new Error("Method not implemented.")
//   }
  
// 	toLocaleString(): string
//   toLocaleString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string
//   toLocaleString(locales?: any, options?: any): string {
//     throw new Error("Method not implemented.")
//   }
  
// 	toLocaleDateString(): string
//   toLocaleDateString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string
//   toLocaleDateString(locales?: any, options?: any): string {
//     throw new Error("Method not implemented.")
//   }
  
// 	toLocaleTimeString(): string
//   toLocaleTimeString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string
//   toLocaleTimeString(locales?: any, options?: any): string {
//     throw new Error("Method not implemented.")
//   }
  
// 	valueOf(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getTime(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getFullYear(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getUTCFullYear(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getMonth(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getUTCMonth(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getDate(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getUTCDate(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getDay(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getUTCDay(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getHours(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getUTCHours(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getMinutes(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getUTCMinutes(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getSeconds(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getUTCSeconds(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getMilliseconds(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getUTCMilliseconds(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	getTimezoneOffset(): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setTime(time: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setMilliseconds(ms: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setUTCMilliseconds(ms: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setSeconds(sec: number, ms?: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setUTCSeconds(sec: number, ms?: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setMinutes(min: number, sec?: number, ms?: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setUTCMinutes(min: number, sec?: number, ms?: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setHours(hours: number, min?: number, sec?: number, ms?: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setUTCHours(hours: number, min?: number, sec?: number, ms?: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setDate(date: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setUTCDate(date: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setMonth(month: number, date?: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setUTCMonth(month: number, date?: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setFullYear(year: number, month?: number, date?: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	setUTCFullYear(year: number, month?: number, date?: number): number {
//     throw new Error("Method not implemented.")
//   }
  
// 	toUTCString(): string {
//     throw new Error("Method not implemented.")
//   }
  
// 	toISOString(): string {
//     throw new Error("Method not implemented.")
//   }
  
// 	toJSON(key?: any): string {
//     throw new Error("Method not implemented.")
//   }
  
// 	getVarDate: () => VarDate
//   [Symbol.toPrimitive](hint: "default"): string
//   [Symbol.toPrimitive](hint: "string"): string
//   [Symbol.toPrimitive](hint: "number"): number
//   [Symbol.toPrimitive](hint: string): string | number
//   [Symbol.toPrimitive](hint: any): string | number {
//     throw new Error("Method not implemented.")
//   }
  
// }

// function dateFormat() {
// 	let	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g
// 	let	timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g
// 	let	timezoneClip = /[^-+\dA-Z]/g
// 	let	pad = function (val : string | number | Date | D8, len : number) {
//     val = String(val)
//     len = len || 2
//     while (val.length < len) val = "0" + val
//     return val
//   }

// 	// Regexes and supporting functions are cached through closure
// 	return function (date, mask, utc) {
// 		let dF = dateFormat

// 		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
// 		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
// 			mask = date
// 			date = undefined
// 		}

// 		// Passing date through Date applies Date.parse, if necessary
// 		date = date ? new Date(date) : new Date
// 		if (isNaN(date)) throw SyntaxError("invalid date")

// 		mask = String(dF.masks[mask] || mask || dF.masks["default"])

// 		// Allow setting the utc argument via the mask
// 		if (mask.slice(0, 4) == "UTC:") {
// 			mask = mask.slice(4)
// 			utc = true
// 		}

// 		var	_ = utc ? "getUTC" : "get",
// 			d = date[_ + "Date"](),
// 			D = date[_ + "Day"](),
// 			m = date[_ + "Month"](),
// 			y = date[_ + "FullYear"](),
// 			H = date[_ + "Hours"](),
// 			M = date[_ + "Minutes"](),
// 			s = date[_ + "Seconds"](),
// 			L = date[_ + "Milliseconds"](),
// 			o = utc ? 0 : date.getTimezoneOffset(),
// 			flags = {
// 				d:    d,
// 				dd:   pad(d),
// 				ddd:  dF.i18n.dayNames[D],
// 				dddd: dF.i18n.dayNames[D + 7],
// 				m:    m + 1,
// 				mm:   pad(m + 1),
// 				mmm:  dF.i18n.monthNames[m],
// 				mmmm: dF.i18n.monthNames[m + 12],
// 				yy:   String(y).slice(2),
// 				yyyy: y,
// 				h:    H % 12 || 12,
// 				hh:   pad(H % 12 || 12),
// 				H:    H,
// 				HH:   pad(H),
// 				M:    M,
// 				MM:   pad(M),
// 				s:    s,
// 				ss:   pad(s),
// 				l:    pad(L, 3),
// 				L:    pad(L > 99 ? Math.round(L / 10) : L),
// 				t:    H < 12 ? "a"  : "p",
// 				tt:   H < 12 ? "am" : "pm",
// 				T:    H < 12 ? "A"  : "P",
// 				TT:   H < 12 ? "AM" : "PM",
// 				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
// 				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
// 				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
// 			}

// 		return mask.replace(token, function ($0) {
// 			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1)
// 		})
// 	}
// }()



// // Internationalization strings
// dateFormat.i18n = {
// 	dayNames: [
// 		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
// 		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
// 	],
// 	monthNames: [
// 		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// 		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
// 	]
// }
