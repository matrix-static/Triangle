Jx().package("T.UI.Controls", function(J){
    // 严格模式
    'use strict';

    var _crrentPluginId = 0;
    var defaults = {
        // 选项
        // fooOption: true,
        // 覆写 类方法
        // parseData: undefined,
        // 事件
        // onFooSelected: undefined,
        // onFooChange: function(e, data){}
    };
    var attributeMap = {
        // fooOption: 'foo-option'
    };

    var __daysIn = [ 31,28,31,30,31,30,31,31,30,31,30,31 ];     // 每个月有多少天
    var __initialized = false;                                  // 是否已经初始化
    var __pickers = [];                                         // 设置了多少个控件
    // 取绝对值，转换成字符串 在前面填充 0 到长度 len
    function pad( value, length )
    {
        var s = String(Math.abs(value));
        while ( s.length < length ){
            s = '0'+s;
        }            
        if ( value < 0 ){
            s = '-'+s;
        }
        return s;
    }

    // Converter 私有变量
    var _flen = 0;
    var _longDay = 9;
    var _longMon = 9;
    var _shortDay = 6;
    var _shortMon = 3;
    var _offAl = Number.MIN_VALUE; // format time zone offset alleged
    var _offCap = Number.MIN_VALUE; // parsed time zone offset captured
    var _offF = Number.MIN_VALUE; // format time zone offset imposed
    var _offFSI = (-1); // format time zone label subindex
    var _offP = Number.MIN_VALUE; // parsed time zone offset assumed
    var _offPSI = (-1);        // parsed time zone label subindex captured
    var _captureOffset = false;

    var Converter = new J.Class({
        defaults: defaults,
        attributeMap: attributeMap,
        init: function(options){           

            // public members

            this.fmt = '%Y-%m-%d %T';
            // this.dAbbr = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            this.dAbbr = ['日','一','二','三','四','五','六'];
            this.dNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            // this.eAbbr = ['BCE','CE'];
            // this.mAbbr = [ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec' ];
            this.eAbbr = ['公元前','公元'];
            this.mAbbr = [ '一','二','三','四','五','六','七','八','九','十','十一','十二' ];
            this.mNames = [ 'January','February','March','April','May','June','July','August','September','October','November','December' ];
            this.baseYear = null;

            // -- 原构造函数开始 --

            var i, len;

            options = $.extend(true, {} , options || {});

            // 年 最小值
            if ( options.baseYear ){
                this.baseYear = Number(options.baseYear);
            }
            // 格式
            if ( options.format ){
                this.fmt = options.format;
            }

            _flen = this.fmt.length;

            // 星期 的名称缩写 sum, mon
            if ( options.dayAbbreviations ){
                this.dAbbr = $.makeArray( options.dayAbbreviations );
            }

            // 星期 的名称全名
            if ( options.dayNames )
            {
                this.dNames = $.makeArray( options.dayNames );
                _longDay = 1;
                _shortDay = 1000;
                for ( i = 0 ; i < 7 ; i++ )
                {
                len = this.dNames[i].length;
                    if ( len > _longDay ){
                        _longDay = len;
                    }
                    if ( len < _shortDay ){
                        _shortDay = len;
                    }
                }
            }

            // 公元前 / 公元 
            if ( options.eraAbbreviations )
                this.eAbbr = $.makeArray(options.eraAbbreviations);
            // 月份 的名称缩写
            if ( options.monthAbbreviations )
                this.mAbbr = $.makeArray(options.monthAbbreviations);
            // 月份 的名称全称
            if ( options.monthNames )
            {
                this.mNames = $.makeArray( options.monthNames );
                _longMon = 1;
                _shortMon = 1000;
                for ( i = 0 ; i < 12 ; i++ )
                {
                    len = this.mNames[i].length;
                    if ( len > _longMon )
                        _longMon = len;
                    if ( len < _shortMon )
                        _shortMon = len;
                }
            }
            // UTC 时区偏移 (单位：分钟)
            if ( typeof options.utcFormatOffsetImposed != "undefined" )
                _offF = options.utcFormatOffsetImposed;

            if ( typeof options.utcParseOffsetAssumed != "undefined" )
                _offP = options.utcParseOffsetAssumed;

            if ( options.utcParseOffsetCapture )
                _captureOffset = true;
        },
        // 指定位置字符是否是数字
        dAt: function( str, pos )
        {
            return (
                        (str.charCodeAt(pos)>='0'.charCodeAt(0)) 
                        && (str.charCodeAt(pos)<='9'.charCodeAt(0))
                    );
        },
        // 将 Date 对象，格式化为一个字符串
        format: function( date )
        {
            var d = new Date(date.getTime());
            if ( ( _offAl == Number.MIN_VALUE ) && ( _offF != Number.MIN_VALUE ) )
                d.setTime( ( d.getTime() + (d.getTimezoneOffset()*60000) ) + (_offF*60000) );

            var t;
            var str = '';
            for ( var f = 0 ; f < _flen ; f++ )
            {
              if ( this.fmt.charAt(f) != '%' )
                str += this.fmt.charAt(f);
              else
              {
                var ch = this.fmt.charAt(f+1)
                switch ( ch )
                {
                  case 'a': // Abbreviated weekday name (Sun..Sat)
                    str += this.dAbbr[ d.getDay() ];
                    break;
                  case 'B': // BCE string (eAbbr[0], usually BCE or BC, only if appropriate) (NON-MYSQL)
                    if ( d.getFullYear() < 0 )
                      str += this.eAbbr[0];
                    break;
                  case 'b': // Abbreviated month name (Jan..Dec)
                    str += this.mAbbr[ d.getMonth() ];
                    break;
                  case 'C': // CE string (eAbbr[1], usually CE or AD, only if appropriate) (NON-MYSQL)
                    if ( d.getFullYear() > 0 )
                      str += this.eAbbr[1];
                    break;
                  case 'c': // Month, numeric (0..12)
                    str += d.getMonth()+1;
                    break;
                  case 'd': // Day of the month, numeric (00..31)
                    t = d.getDate();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'D': // Day of the month with English suffix (0th, 1st,...)
                    t = String(d.getDate());
                    str += t;
                    if ( ( t.length == 2 ) && ( t.charAt(0) == '1' ) )
                      str += 'th';
                    else
                    {
                      switch ( t.charAt( t.length-1 ) )
                      {
                        case '1': str += 'st'; break;
                        case '2': str += 'nd'; break;
                        case '3': str += 'rd'; break;
                        default: str += 'th'; break;
                      }
                    }
                    break;
                  case 'E': // era string (from eAbbr[], BCE, CE, BC or AD) (NON-MYSQL)
                    str += this.eAbbr[ (d.getFullYear()<0) ? 0 : 1 ];
                    break;
                  case 'e': // Day of the month, numeric (0..31)
                    str += d.getDate();
                    break;
                  case 'H': // Hour (00..23)
                    t = d.getHours();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'h': // Hour (01..12)
                  case 'I': // Hour (01..12)
                    t = d.getHours() % 12;
                    if ( t === 0 )
                      str += '12';
                    else
                    {
                      if ( t < 10 ) str += '0';
                      str += String(t);
                    }
                    break;
                  case 'i': // Minutes, numeric (00..59)
                    t = d.getMinutes();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'k': // Hour (0..23)
                    str += d.getHours();
                    break;
                  case 'l': // Hour (1..12)
                    t = d.getHours() % 12;
                    if ( t === 0 )
                      str += '12';
                    else
                      str += String(t);
                    break;
                  case 'M': // Month name (January..December)
                    str += this.mNames[ d.getMonth() ];
                    break;
                  case 'm': // Month, numeric (00..12)
                    t = d.getMonth() + 1;
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'p': // AM or PM
                    str += ( ( d.getHours() < 12 ) ? 'AM' : 'PM' );
                    break;
                  case 'r': // Time, 12-hour (hh:mm:ss followed by AM or PM)
                    t = d.getHours() % 12;
                    if ( t === 0 )
                      str += '12:';
                    else
                    {
                      if ( t < 10 ) str += '0';
                      str += String(t) + ':';
                    }
                    t = d.getMinutes();
                    if ( t < 10 ) str += '0';
                    str += String(t) + ':';
                    t = d.getSeconds();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    str += ( ( d.getHours() < 12 ) ? 'AM' : 'PM' );
                    break;
                  case 'S': // Seconds (00..59)
                  case 's': // Seconds (00..59)
                    t = d.getSeconds();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'T': // Time, 24-hour (hh:mm:ss)
                    t = d.getHours();
                    if ( t < 10 ) str += '0';
                    str += String(t) + ':';
                    t = d.getMinutes();
                    if ( t < 10 ) str += '0';
                    str += String(t) + ':';
                    t = d.getSeconds();
                    if ( t < 10 ) str += '0';
                    str += String(t);
                    break;
                  case 'W': // Weekday name (Sunday..Saturday)
                    str += this.dNames[ d.getDay() ];
                    break;
                  case 'w': // Day of the week (0=Sunday..6=Saturday)
                    str += d.getDay();
                    break;
                  case 'Y': // Year, numeric, four digits (negative if before 0001)
                    str += pad(d.getFullYear(),4);
                    break;
                  case 'y': // Year, numeric (two digits, negative if before 0001)
                    t = d.getFullYear() % 100;
                    str += pad(t,2);
                    break;
                  case 'Z': // Year, numeric, four digits, unsigned (NON-MYSQL)
                    str += pad(Math.abs(d.getFullYear()),4);
                    break;
                  case 'z': // Year, numeric, variable length, unsigned (NON-MYSQL)
                    str += Math.abs(d.getFullYear());
                    break;
                  case '%': // A literal '%' character
                    str += '%';
                    break;
                  case '#': // signed timezone offset in minutes
                  {
                    t = ( _offAl != Number.MIN_VALUE ) ? _offAl :
                        ( _offF == Number.MIN_VALUE ) ? (0-d.getTimezoneOffset()) : _offF;
                    if ( t >= 0 )
                        str += '+';
                    str += t;
                    break;
                  }
                  case '@': // timezone offset label
                  {
                    t = ( _offAl != Number.MIN_VALUE ) ? _offAl :
                        ( _offF == Number.MIN_VALUE ) ? (0-d.getTimezoneOffset()) : _offF;
                    if ( AnyTime.utcLabel && AnyTime.utcLabel[t] )
                    {
                      if ( ( _offFSI > 0 ) && ( _offFSI < AnyTime.utcLabel[t].length ) )
                        str += AnyTime.utcLabel[t][_offFSI];
                      else
                        str += AnyTime.utcLabel[t][0];
                      break;
                    }
                    str += 'UTC';
                    ch = ':'; // drop through for offset formatting
                    break;
                  }
                  case '+': // signed, 4-digit timezone offset in hours and minutes
                  case '-': // signed, 3-or-4-digit timezone offset in hours and minutes
                  case ':': // signed 4-digit timezone offset with colon delimiter
                  case ';': // signed 3-or-4-digit timezone offset with colon delimiter
                    t = ( _offAl != Number.MIN_VALUE ) ? _offAl :
                            ( _offF == Number.MIN_VALUE ) ? (0-d.getTimezoneOffset()) : _offF;
                    if ( t < 0 )
                      str += '-';
                    else
                      str += '+';
                    t = Math.abs(t);
                    str += ((ch=='+')||(ch==':')) ? pad(Math.floor(t/60),2) : Math.floor(t/60);
                    if ( (ch==':') || (ch==';') )
                      str += ':';
                    str += pad(t%60,2);
                    break;
                  case 'f': // Microseconds (000000..999999)
                  case 'j': // Day of year (001..366)
                  case 'U': // Week (00..53), where Sunday is the first day of the week
                  case 'u': // Week (00..53), where Monday is the first day of the week
                  case 'V': // Week (01..53), where Sunday is the first day of the week; used with %X
                  case 'v': // Week (01..53), where Monday is the first day of the week; used with %x
                  case 'X': // Year for the week where Sunday is the first day of the week, numeric, four digits; used with %V
                  case 'x': // Year for the week, where Monday is the first day of the week, numeric, four digits; used with %v
                    throw '%'+ch+' not implemented by AnyTime.Converter';
                  default: // for any character not listed above
                    str += this.fmt.substr(f,2);
                } // switch ( this.fmt.charAt(f+1) )
                f++;
              } // else
            } // for ( var f = 0 ; f < _flen ; f++ )
            return str;
        },
        getUtcParseOffsetCaptured: function()
        {
            return _offCap;
        },
        getUtcParseOffsetSubIndex: function()
        {
            return _offPSI;
        },
        // 将字符串转换为一个 Date 对象
        parse: function( str )
        {
            _offCap = _offP;
            _offPSI = (-1);
            var era = 1;
            var time = new Date(4,0,1,0,0,0,0);//4=leap year bug
            var slen = str.length;
            var s = 0;
            var tzSign = 1, tzOff = _offP;
            var i, matched, sub, sublen, temp;
            for ( var f = 0 ; f < _flen ; f++ )
            {
              if ( this.fmt.charAt(f) == '%' )
              {
                var ch = this.fmt.charAt(f+1);
                switch ( ch )
                {
                  case 'a': // Abbreviated weekday name (Sun..Sat)
                    matched = false;
                    for ( sublen = 0 ; s + sublen < slen ; sublen++ )
                    {
                      sub = str.substr(s,sublen);
                      for ( i = 0 ; i < 12 ; i++ )
                        if ( this.dAbbr[i] == sub )
                        {
                          matched = true;
                          s += sublen;
                          break;
                        }
                      if ( matched )
                        break;
                    } // for ( sublen ... )
                    if ( ! matched )
                      throw 'unknown weekday: '+str.substr(s);
                    break;
                  case 'B': // BCE string (eAbbr[0]), only if needed. (NON-MYSQL)
                    sublen = this.eAbbr[0].length;
                    if ( ( s + sublen <= slen ) && ( str.substr(s,sublen) == this.eAbbr[0] ) )
                    {
                      era = (-1);
                      s += sublen;
                    }
                    break;
                  case 'b': // Abbreviated month name (Jan..Dec)
                    matched = false;
                    for ( sublen = 0 ; s + sublen < slen ; sublen++ )
                    {
                      sub = str.substr(s,sublen);
                      for ( i = 0 ; i < 12 ; i++ )
                        if ( this.mAbbr[i] == sub )
                        {
                          time.setMonth( i );
                          matched = true;
                          s += sublen;
                          break;
                        }
                      if ( matched )
                        break;
                    } // for ( sublen ... )
                    if ( ! matched )
                      throw 'unknown month: '+str.substr(s);
                    break;
                  case 'C': // CE string (eAbbr[1]), only if needed. (NON-MYSQL)
                    sublen = this.eAbbr[1].length;
                    if ( ( s + sublen <= slen ) && ( str.substr(s,sublen) == this.eAbbr[1] ) )
                      s += sublen; // note: CE is the default era
                    break;
                  case 'c': // Month, numeric (0..12)
                    if ( ( s+1 < slen ) && this.dAt(str,s+1) )
                    {
                      time.setMonth( (Number(str.substr(s,2))-1)%12 );
                      s += 2;
                    }
                    else
                    {
                      time.setMonth( (Number(str.substr(s,1))-1)%12 );
                      s++;
                    }
                    break;
                  case 'D': // Day of the month with English suffix (0th,1st,...)
                    if ( ( s+1 < slen ) && this.dAt(str,s+1) )
                    {
                      time.setDate( Number(str.substr(s,2)) );
                      s += 4;
                    }
                    else
                    {
                      time.setDate( Number(str.substr(s,1)) );
                      s += 3;
                    }
                    break;
                  case 'd': // Day of the month, numeric (00..31)
                    time.setDate( Number(str.substr(s,2)) );
                    s += 2;
                    break;
                  case 'E': // era string (from eAbbr[]) (NON-MYSQL)
                    sublen = this.eAbbr[0].length;
                    if ( ( s + sublen <= slen ) && ( str.substr(s,sublen) == this.eAbbr[0] ) )
                    {
                      era = (-1);
                      s += sublen;
                    }
                    else if ( ( s + ( sublen = this.eAbbr[1].length ) <= slen ) && ( str.substr(s,sublen) == this.eAbbr[1] ) )
                      s += sublen; // note: CE is the default era
                    else
                      throw 'unknown era: '+str.substr(s);
                    break;
                  case 'e': // Day of the month, numeric (0..31)
                    if ( ( s+1 < slen ) && this.dAt(str,s+1) )
                    {
                      time.setDate( Number(str.substr(s,2)) );
                      s += 2;
                    }
                    else
                    {
                      time.setDate( Number(str.substr(s,1)) );
                      s++;
                    }
                    break;
                  case 'f': // Microseconds (000000..999999)
                    s += 6; // SKIPPED!
                    break;
                  case 'H': // Hour (00..23)
                    time.setHours( Number(str.substr(s,2)) );
                    s += 2;
                    break;
                  case 'h': // Hour (01..12)
                  case 'I': // Hour (01..12)
                    time.setHours( Number(str.substr(s,2)) );
                    s += 2;
                    break;
                  case 'i': // Minutes, numeric (00..59)
                    time.setMinutes( Number(str.substr(s,2)) );
                    s += 2;
                    break;
                  case 'k': // Hour (0..23)
                    if ( ( s+1 < slen ) && this.dAt(str,s+1) )
                    {
                      time.setHours( Number(str.substr(s,2)) );
                      s += 2;
                    }
                    else
                    {
                      time.setHours( Number(str.substr(s,1)) );
                      s++;
                    }
                    break;
                  case 'l': // Hour (1..12)
                    if ( ( s+1 < slen ) && this.dAt(str,s+1) )
                    {
                      time.setHours( Number(str.substr(s,2)) );
                      s += 2;
                    }
                    else
                    {
                      time.setHours( Number(str.substr(s,1)) );
                      s++;
                    }
                    break;
                  case 'M': // Month name (January..December)
                    matched = false;
                    for (sublen=_shortMon ; s + sublen <= slen ; sublen++ )
                    {
                      if ( sublen > _longMon )
                        break;
                      sub = str.substr(s,sublen);
                      for ( i = 0 ; i < 12 ; i++ )
                      {
                        if ( this.mNames[i] == sub )
                        {
                          time.setMonth( i );
                          matched = true;
                          s += sublen;
                          break;
                        }
                      }
                      if ( matched )
                        break;
                    }
                    break;
                  case 'm': // Month, numeric (00..12)
                    time.setMonth( (Number(str.substr(s,2))-1)%12 );
                    s += 2;
                    break;
                  case 'p': // AM or PM
                  if ( time.getHours() == 12 )
                  {
                      if ( str.charAt(s) == 'A' )
                        time.setHours(0);
                  }
                  else if ( str.charAt(s) == 'P' )
                      time.setHours( time.getHours() + 12 );
                    s += 2;
                    break;
                  case 'r': // Time, 12-hour (hh:mm:ss followed by AM or PM)
                    time.setHours(Number(str.substr(s,2)));
                    time.setMinutes(Number(str.substr(s+3,2)));
                    time.setSeconds(Number(str.substr(s+6,2)));
                  if ( time.getHours() == 12 )
                  {
                      if ( str.charAt(s+8) == 'A' )
                        time.setHours(0);
                  }
                  else if ( str.charAt(s+8) == 'P' )
                      time.setHours( time.getHours() + 12 );
                    s += 10;
                    break;
                  case 'S': // Seconds (00..59)
                  case 's': // Seconds (00..59)
                    time.setSeconds(Number(str.substr(s,2)));
                    s += 2;
                    break;
                  case 'T': // Time, 24-hour (hh:mm:ss)
                    time.setHours(Number(str.substr(s,2)));
                    time.setMinutes(Number(str.substr(s+3,2)));
                    time.setSeconds(Number(str.substr(s+6,2)));
                    s += 8;
                    break;
                  case 'W': // Weekday name (Sunday..Saturday)
                    matched = false;
                    for (sublen=_shortDay ; s + sublen <= slen ; sublen++ )
                    {
                      if ( sublen > _longDay )
                        break;
                      sub = str.substr(s,sublen);
                      for ( i = 0 ; i < 7 ; i++ )
                      {
                        if ( this.dNames[i] == sub )
                        {
                          matched = true;
                          s += sublen;
                          break;
                        }
                      }
                      if ( matched )
                        break;
                    }
                    break;
                case 'w': // Day of the week (0=Sunday..6=Saturday) (ignored)
                  s += 1;
                  break;
                  case 'Y': // Year, numeric, four digits, negative if before 0001
                    i = 4;
                    if ( str.substr(s,1) == '-' )
                      i++;
                    time.setFullYear(Number(str.substr(s,i)));
                    s += i;
                    break;
                  case 'y': // Year, numeric (two digits), negative before baseYear
                    i = 2;
                    if ( str.substr(s,1) == '-' )
                      i++;
                    temp = Number(str.substr(s,i));
                    if ( typeof(this.baseYear) == 'number' )
                        temp += this.baseYear;
                    else if ( temp < 70 )
                        temp += 2000;
                    else
                        temp += 1900;
                    time.setFullYear(temp);
                    s += i;
                    break;
                  case 'Z': // Year, numeric, four digits, unsigned (NON-MYSQL)
                    time.setFullYear(Number(str.substr(s,4)));
                    s += 4;
                    break;
                  case 'z': // Year, numeric, variable length, unsigned (NON-MYSQL)
                    i = 0;
                    while ( ( s < slen ) && this.dAt(str,s) )
                      i = ( i * 10 ) + Number(str.charAt(s++));
                    time.setFullYear(i);
                    break;
                  case '#': // signed timezone offset in minutes.
                    if ( str.charAt(s++) == '-' )
                        tzSign = (-1);
                    for ( tzOff = 0 ; ( s < slen ) && (String(i=Number(str.charAt(s)))==str.charAt(s)) ; s++ )
                        tzOff = ( tzOff * 10 ) + i;
                    tzOff *= tzSign;
                    break;
                  case '@': // timezone label
                  {  _offPSI = (-1);
                    if ( AnyTime.utcLabel )
                    {
                        matched = false;
                        for ( tzOff in AnyTime.utcLabel )
                      if ( ! Array.prototype[tzOff] ) // prototype.js compatibility issue
                          {
                              for ( i = 0 ; i < AnyTime.utcLabel[tzOff].length ; i++ )
                            {
                                sub = AnyTime.utcLabel[tzOff][i];
                                sublen = sub.length;
                                if ( ( s+sublen <= slen ) && ( str.substr(s,sublen) == sub ) )
                                {
                            s+=sublen;
                                    matched = true;
                                    break;
                                }
                            }
                              if ( matched )
                                  break;
                          }
                        if ( matched )
                        {
                            _offPSI = i;
                            tzOff = Number(tzOff);
                            break; // case
                        }
                    }
                    if ( ( s+9 < slen ) || ( str.substr(s,3) != "UTC" ) )
                        throw 'unknown time zone: '+str.substr(s);
                    s += 3;
                    ch = ':'; // drop through for offset parsing
                    break;
                  }
                  case '-': // signed, 3-or-4-digit timezone offset in hours and minutes
                  case '+': // signed, 4-digit timezone offset in hours and minutes
                  case ':': // signed 4-digit timezone offset with colon delimiter
                  case ';': // signed 3-or-4-digit timezone offset with colon delimiter
                    if ( str.charAt(s++) == '-' )
                        tzSign = (-1);
                    tzOff = Number(str.charAt(s));
                    if ( (ch=='+')||(ch==':')||((s+3<slen)&&(String(Number(str.charAt(s+3)))!==str.charAt(s+3))) )
                        tzOff = (tzOff*10) + Number(str.charAt(++s));
                    tzOff *= 60;
                    if ( (ch==':') || (ch==';') )
                        s++; // skip ":" (assumed)
                    tzOff = ( tzOff + Number(str.substr(++s,2)) ) * tzSign;
                    s += 2;
                    break;
                  case 'j': // Day of year (001..366)
                  case 'U': // Week (00..53), where Sunday is the first day of the week
                  case 'u': // Week (00..53), where Monday is the first day of the week
                  case 'V': // Week (01..53), where Sunday is the first day of the week; used with %X
                  case 'v': // Week (01..53), where Monday is the first day of the week; used with %x
                  case 'X': // Year for the week where Sunday is the first day of the week, numeric, four digits; used with %V
                  case 'x': // Year for the week, where Monday is the first day of the week, numeric, four digits; used with %v
                    throw '%'+this.fmt.charAt(f+1)+' not implemented by AnyTime.Converter';
                  case '%': // A literal '%' character
                  // default: // for any character not listed above
                    // throw '%'+this.fmt.charAt(f+1)+' reserved for future use';
                    // break;
                }
                f++;
              } // if ( this.fmt.charAt(f) == '%' )
              else if ( this.fmt.charAt(f) != str.charAt(s) )
                throw str + ' is not in "' + this.fmt + '" format';
              else
                s++;
            } // for ( var f ... )
            if ( era < 0 )
              time.setFullYear( 0 - time.getFullYear() );
            if ( tzOff != Number.MIN_VALUE )
            {
               if ( _captureOffset )
                 _offCap = tzOff;
               else
                 time.setTime( ( time.getTime() - (tzOff*60000) ) - (time.getTimezoneOffset()*60000) );
            }

            return time;
        },
        setUtcFormatOffsetAlleged: function( offset )
        {
            var prev = _offAl;
            _offAl = offset;
            return prev;
        },
        setUtcFormatOffsetSubIndex: function( subIndex )
        {
            var prev = _offFSI;
            _offFSI = subIndex;
            return prev;
        },
        destroy: function(){}
    });

    this.Anytime = new J.Class({extend: T.UI.BaseControl},{
        defaults: defaults,
        attributeMap: attributeMap,
        init: function(element, options){
            var context= this;

            $(document).ready(function(){
                context.onReady();
                __initialized = true;
            });



            this.initialize(element.id, options);
        },

        //  private members

        twelveHr: false,
        // ajaxOpts: null,     // options for AJAX requests
        denyTab: true,      // set to true to stop Opera from tabbing away
        askEra: false,      // prompt the user for the era in yDiv?
        cloak: null,        // cloak div
        conv: null,         // AnyTime.Converter
        div: null,          // picker div
        dB: null,           // body div
        dD: null,           // date div
        dY: null,           // years div
        dMo: null,          // months div
        dDoM: null,         // date-of-month table
        hDoM: null,         // date-of-month heading
        hMo: null,          // month heading
        hTitle: null,       // title heading
        hY: null,           // year heading
        dT: null,           // time div
        dH: null,           // hours div
        dM: null,           // minutes div
        dS: null,           // seconds div
        dO: null,           // offset (time zone) div
        earliest: null,     // earliest selectable date/time
        fBtn: null,         // button with current focus
        fDOW: 0,            // index to use as first day-of-week
        hBlur: null,        // input handler
        hClick: null,       // input handler
        hFocus: null,       // input handler
        hKeydown: null,     // input handler
        hKeypress: null,    // input handler
        hResize: null,      // event handler
        id: null,           // picker ID
        inp: null,          // input text field
        latest: null,       // latest selectable date/time
        // lastAjax: null,     // last value submitted using AJAX
        lostFocus: false,   // when focus is lost, must redraw
        lX: 'X',            // 关闭按钮 label for dismiss button
        // lY: 'Year',         // 年 label for year
        // lO: 'Time Zone',    // 时区 label for UTC offset (time zone)
        lY: '年',           // 年 label for year
        lO: '时区',         // 时区 label for UTC offset (time zone)
        oBody: null,        // UTC offset selector popup
        oConv: null,        // AnyTime.Converter for offset display
        oCur: null,         // current-UTC-offset button
        oDiv: null,         // UTC offset selector popup
        oLab: null,         // UTC offset label
        oList: null,       // UTC offset container
        oSel: null,         // select (plus/minus) UTC-offset button
        offMin: Number.MIN_VALUE, // current UTC offset in minutes
        offSI: -1,          // current UTC label sub-index (if any)
        offStr: "",         // current UTC offset (time zone) string
        pop: true,          // picker is a popup?
        ro: false,          // was input readonly before picker initialized?
        time: null,         // current date/time
        // url: null,          // URL to submit value using AJAX
        yAhead: null,       // years-ahead button
        y0XXX: null,        // millenium-digit-zero button (for focus)
        yCur: null,         // current-year button
        yDiv: null,         // year selector popup
        yLab: null,         // year label
        yNext: null,        // next-year button
        yPast: null,        // years-past button
        yPrior: null,       // prior-year button

        //---------------------------------------------------------------------
        //  .initialize() initializes the picker instance.
        //---------------------------------------------------------------------

        initialize: function( id )
        {
            // var _this = this;
            var context= this;

            this.id = 'AnyTime--'+id.replace(/[^-_.A-Za-z0-9]/g,'--AnyTime--');

            var options = jQuery.extend(true,{},options||{});
            options.utcParseOffsetCapture = true;
            // this.conv = new AnyTime.Converter(options);
            this.conv = new Converter(options);

            if ( options.placement )
            {
                if ( options.placement == 'inline' )
                    this.pop = false;
                else if ( options.placement != 'popup' )
                    throw 'unknown placement: ' + options.placement;
            }

            // if ( options.ajaxOptions )
            // {
            //     this.ajaxOpts = jQuery.extend( {}, options.ajaxOptions );
            //     if ( ! this.ajaxOpts.success )
            //         this.ajaxOpts.success = function(data,status) { context.updVal(data); };
            // }

            if ( options.earliest )
                this.earliest = this.makeDate( options.earliest );

            if ( options.firstDOW )
            {
                if ( ( options.firstDOW < 0 ) || ( options.firstDOW > 6 ) )
                    throw 'illegal firstDOW: ' + options.firstDOW;
                this.fDOW = options.firstDOW;
            }

            if ( options.latest )
                this.latest = this.makeDate( options.latest );

            this.lX = options.labelDismiss || 'X';
            // this.lY = options.labelYear || 'Year';
            // this.lO = options.labelTimeZone || 'Time Zone';
            this.lY = options.labelYear || '年';
            this.lO = options.labelTimeZone || '时区';

            //  Infer what we can about what to display from the format.

            var i;
            var t;
            var lab;
            var shownFields = 0;
            var format = this.conv.fmt;

            if ( typeof options.askEra != 'undefined' )
                this.askEra = options.askEra;
            else
                this.askEra = (format.indexOf('%B')>=0) || (format.indexOf('%C')>=0) || (format.indexOf('%E')>=0);
            var askYear = (format.indexOf('%Y')>=0) || (format.indexOf('%y')>=0) || (format.indexOf('%Z')>=0) || (format.indexOf('%z')>=0);
            var askMonth = (format.indexOf('%b')>=0) || (format.indexOf('%c')>=0) || (format.indexOf('%M')>=0) || (format.indexOf('%m')>=0);
            var askDoM = (format.indexOf('%D')>=0) || (format.indexOf('%d')>=0) || (format.indexOf('%e')>=0);
            var askDate = askYear || askMonth || askDoM;
            this.twelveHr = (format.indexOf('%h')>=0) || (format.indexOf('%I')>=0) || (format.indexOf('%l')>=0) || (format.indexOf('%r')>=0);
            var askHour = this.twelveHr || (format.indexOf('%H')>=0) || (format.indexOf('%k')>=0) || (format.indexOf('%T')>=0);
            var askMinute = (format.indexOf('%i')>=0) || (format.indexOf('%r')>=0) || (format.indexOf('%T')>=0);
            var askSec = ( (format.indexOf('%r')>=0) || (format.indexOf('%S')>=0) || (format.indexOf('%s')>=0) || (format.indexOf('%T')>=0) );
            if ( askSec && ( typeof options.askSecond != 'undefined' ) )
                askSec = options.askSecond;
            var askOff = ( (format.indexOf('%#')>=0) || (format.indexOf('%+')>=0) || (format.indexOf('%-')>=0) || (format.indexOf('%:')>=0) || (format.indexOf('%;')>=0) || (format.indexOf('%<')>=0) || (format.indexOf('%>')>=0) || (format.indexOf('%@')>=0) );
            var askTime = askHour || askMinute || askSec || askOff;

            if ( askOff )
                // this.oConv = new AnyTime.Converter( { format: options.formatUtcOffset ||
                this.oConv = new Converter( { format: options.formatUtcOffset ||
                    format.match(/\S*%[-+:;<>#@]\S*/g).join(' ') } );

            //  Create the picker HTML and add it to the page.
            //  Popup pickers will be moved to the end of the body
            //  once the entire page has loaded.

            this.inp = $(document.getElementById(id)); // avoids ID-vs-pseudo-selector probs like id="foo:bar"
            this.ro = this.inp.prop('readonly');
            this.inp.prop('readonly',true);
            this.div = $( '<div class="AnyTime-win AnyTime-pkr ui-widget ui-widget-content ui-corner-all" id="' + this.id + '" aria-live="off"></div>' );
            this.inp.after(this.div);
            this.hTitle = $( '<h5 class="AnyTime-hdr ui-widget-header ui-corner-top"/>' );
            this.div.append( this.hTitle );
            this.dB = $( '<div class="AnyTime-body"></div>' );
            this.div.append( this.dB );

            if ( options.hideInput )
                this.inp.css({border:0,height:'1px',margin:0,padding:0,width:'1px'});

            //  Add dismiss box to title (if popup)

            t = null;
            var xDiv = null;
            if ( this.pop )
            {
                xDiv = $( '<div class="AnyTime-x-btn ui-state-default">'+this.lX+'</div>' );
                this.hTitle.append( xDiv );
                xDiv.click(function(e){context.dismiss(e);});
            }

            //  date (calendar) portion

            lab = '';
            if ( askDate )
            {
                this.dD = $( '<div class="AnyTime-date"></div>' );
                this.dB.append( this.dD );

                if ( askYear )
                {
                    this.yLab = $('<h6 class="AnyTime-lbl AnyTime-lbl-yr">' + this.lY + '</h6>');
                    this.dD.append( this.yLab );

                    this.dY = $( '<ul class="AnyTime-yrs ui-helper-reset" />' );
                    this.dD.append( this.dY );

                    this.yPast = this.btn(this.dY,'&lt;',this.newYear,['yrs-past'],'- '+this.lY);
                    this.yPrior = this.btn(this.dY,'1',this.newYear,['yr-prior'],'-1 '+this.lY);
                    this.yCur = this.btn(this.dY,'2',this.newYear,['yr-cur'],this.lY);
                    this.yCur.removeClass('ui-state-default');
                    this.yCur.addClass('AnyTime-cur-btn ui-state-default ui-state-highlight');

                    this.yNext = this.btn(this.dY,'3',this.newYear,['yr-next'],'+1 '+this.lY);
                    this.yAhead = this.btn(this.dY,'&gt;',this.newYear,['yrs-ahead'],'+ '+this.lY);

                    shownFields++;
                } // if ( askYear )

                if ( askMonth )
                {
                    // lab = options.labelMonth || 'Month';
                    lab = options.labelMonth || '月';
                    this.hMo = $( '<h6 class="AnyTime-lbl AnyTime-lbl-month">' + lab + '</h6>' );
                    this.dD.append( this.hMo );
                    this.dMo = $('<ul class="AnyTime-mons" />');
                    this.dD.append(this.dMo);
                    for ( i = 0 ; i < 12 ; i++ )
                    {
                        var mBtn = this.btn( this.dMo, this.conv.mAbbr[i],
                            function( event )
                            {
                                var elem = $(event.target);
                                if ( elem.hasClass("AnyTime-out-btn") )
                                    return;
                                var mo = event.target.AnyTime_month;
                                var t = new Date(this.time.getTime());
                                if ( t.getDate() > __daysIn[mo] )
                                    t.setDate(__daysIn[mo])
                                t.setMonth(mo);
                                this.set(t);
                                this.upd(elem);
                            },
                            ['mon','mon'+String(i+1)], lab+' '+this.conv.mNames[i] );
                        mBtn[0].AnyTime_month = i;
                    }
                    shownFields++;
                }

                if ( askDoM )
                {
                    //lab = options.labelDayOfMonth || 'Day of Month';
                    lab = options.labelDayOfMonth || '日';
                    this.hDoM = $('<h6 class="AnyTime-lbl AnyTime-lbl-dom">' + lab + '</h6>' );
                    this.dD.append( this.hDoM );
                    this.dDoM =  $( '<table border="0" cellpadding="0" cellspacing="0" class="AnyTime-dom-table"/>' );
                    this.dD.append( this.dDoM );
                    t = $( '<thead class="AnyTime-dom-head"/>' );
                    this.dDoM.append(t);
                    var tr = $( '<tr class="AnyTime-dow"/>' );
                    t.append(tr);
                    for ( i = 0 ; i < 7 ; i++ )
                      tr.append( '<th class="AnyTime-dow AnyTime-dow'+String(i+1)+'">'+this.conv.dAbbr[(this.fDOW+i)%7]+'</th>' );

                    var tbody = $( '<tbody class="AnyTime-dom-body" />' );
                    this.dDoM.append(tbody);
                    for ( var r = 0 ; r < 6 ; r++ )
                    {
                      tr = $( '<tr class="AnyTime-wk AnyTime-wk'+String(r+1)+'"/>' );
                      tbody.append(tr);
                      for ( i = 0 ; i < 7 ; i++ )
                          this.btn( tr, 'x',
                            function( event )
                            {
                                var elem = $(event.target);
                                if ( elem.hasClass("AnyTime-out-btn") )
                                    return;
                                var dom = Number(elem.html());
                                if ( dom )
                                {
                                    var t = new Date(this.time.getTime());
                                    t.setDate(dom);
                                    this.set(t);
                                    this.upd(elem);
                                }
                            },
                            ['dom'], lab );
                    }
                    shownFields++;

                } // if ( askDoM )

            } // if ( askDate )

            //  time portion

            if ( askTime )
            {
                var tensDiv, onesDiv;

                this.dT = $('<div class="AnyTime-time"></div>');
                this.dB.append(this.dT);

                if ( askHour )
                {
                this.dH = $('<div class="AnyTime-hrs"></div>');
                this.dT.append(this.dH);

                // lab = options.labelHour || 'Hour';
                lab = options.labelHour || '时';
                this.dH.append( $('<h6 class="AnyTime-lbl AnyTime-lbl-hr">'+lab+'</h6>') );
                var amDiv = $('<ul class="AnyTime-hrs-am"/>');
                this.dH.append( amDiv );
                var pmDiv = $('<ul class="AnyTime-hrs-pm"/>');
                this.dH.append( pmDiv );

                for ( i = 0 ; i < 12 ; i++ )
                {
                    if ( this.twelveHr )
                    {
                    if ( i === 0 )
                        t = '12am';
                        else
                        t = String(i)+'am';
                    }
                    else
                        t = pad(i,2);

                    this.btn( amDiv, t, this.newHour,['hr','hr'+String(i)],lab+' '+t);

                    if ( this.twelveHr )
                    {
                        if ( i === 0 )
                            t = '12pm';
                        else
                            t = String(i)+'pm';
                    }
                    else
                        t = i+12;

                    this.btn( pmDiv, t, this.newHour,['hr','hr'+String(i+12)],lab+' '+t);
                }

                shownFields++;

              } // if ( askHour )

              if ( askMinute )
              {
                this.dM = $('<div class="AnyTime-mins"></div>');
                this.dT.append(this.dM);

                // lab = options.labelMinute || 'Minute';
                lab = options.labelMinute || '分';
                this.dM.append( $('<h6 class="AnyTime-lbl AnyTime-lbl-min">'+lab+'</h6>') );
                tensDiv = $('<ul class="AnyTime-mins-tens"/>');
                this.dM.append(tensDiv);

                for ( i = 0 ; i < 6 ; i++ )
                  this.btn( tensDiv, i, function( event ){
                              var elem = $(event.target);
                              if ( elem.hasClass("AnyTime-out-btn") )
                                    return;
                              var t = new Date(this.time.getTime());
                              t.setMinutes( (Number(elem.text())*10) + (this.time.getMinutes()%10) );
                              this.set(t);
                              this.upd(elem);
                          },
                          ['min-ten','min'+i+'0'], lab+' '+i+'0' );
                for ( ; i < 12 ; i++ )
                      this.btn( tensDiv, '&#160;', $.noop, ['min-ten','min'+i+'0'], lab+' '+i+'0' ).addClass('AnyTime-min-ten-btn-empty ui-state-default ui-state-disabled');

                onesDiv = $('<ul class="AnyTime-mins-ones"/>');
                this.dM.append(onesDiv);
                for ( i = 0 ; i < 10 ; i++ )
                  this.btn( onesDiv, i,
                      function( event )
                      {
                          var elem = $(event.target);
                          if ( elem.hasClass("AnyTime-out-btn") )
                                return;
                          var t = new Date(this.time.getTime());
                          t.setMinutes( (Math.floor(this.time.getMinutes()/10)*10)+Number(elem.text()) );
                          this.set(t);
                          this.upd(elem);
                      },
                      ['min-one','min'+i], lab+' '+i );
                for ( ; i < 12 ; i++ )
                    this.btn( onesDiv, '&#160;', $.noop, ['min-one','min'+i+'0'], lab+' '+i ).addClass('AnyTime-min-one-btn-empty ui-state-default ui-state-disabled');

                shownFields++;

              } // if ( askMinute )

              if ( askSec )
              {
                this.dS = $('<div class="AnyTime-secs"></div>');
                this.dT.append(this.dS);
                // lab = options.labelSecond || 'Second';
                lab = options.labelSecond || '秒';
                this.dS.append( $('<h6 class="AnyTime-lbl AnyTime-lbl-sec">'+lab+'</h6>') );
                tensDiv = $('<ul class="AnyTime-secs-tens"/>');
                this.dS.append(tensDiv);

                for ( i = 0 ; i < 6 ; i++ )
                  this.btn( tensDiv, i,function( event ){
                          var elem = $(event.target);
                          if ( elem.hasClass("AnyTime-out-btn") )
                                return;
                          var t = new Date(this.time.getTime());
                          t.setSeconds( (Number(elem.text())*10) + (this.time.getSeconds()%10) );
                          this.set(t);
                          this.upd(elem);
                      },
                      ['sec-ten','sec'+i+'0'], lab+' '+i+'0' );
                for ( ; i < 12 ; i++ )
                      this.btn( tensDiv, '&#160;', $.noop, ['sec-ten','sec'+i+'0'], lab+' '+i+'0' ).addClass('AnyTime-sec-ten-btn-empty ui-state-default ui-state-disabled');

                onesDiv = $('<ul class="AnyTime-secs-ones"/>');
                this.dS.append(onesDiv);
                for ( i = 0 ; i < 10 ; i++ )
                  this.btn( onesDiv, i,function( event ){
                          var elem = $(event.target);
                          if ( elem.hasClass("AnyTime-out-btn") )
                                return;
                          var t = new Date(this.time.getTime());
                          t.setSeconds( (Math.floor(this.time.getSeconds()/10)*10) + Number(elem.text()) );
                          this.set(t);
                          this.upd(elem);
                      },
                      ['sec-one','sec'+i], lab+' '+i );
                for ( ; i < 12 ; i++ )
                      this.btn( onesDiv, '&#160;', $.noop, ['sec-one','sec'+i+'0'], lab+' '+i ).addClass('AnyTime-sec-one-btn-empty ui-state-default ui-state-disabled');

                shownFields++;

              } // if ( askSec )

              if ( askOff )
              {
                this.dO = $('<div class="AnyTime-offs" ></div>');
                this.dT.append('<br />');
                this.dT.append(this.dO);

                this.oList = $('<ul class="AnyTime-off-list ui-helper-reset" />');
                this.dO.append(this.oList);

                this.oCur = this.btn(this.oList,'',this.newOffset,['off','off-cur'],lab);
                this.oCur.removeClass('ui-state-default');
                this.oCur.addClass('AnyTime-cur-btn ui-state-default ui-state-highlight');

                this.oSel = this.btn(this.oList,'&#177;',this.newOffset,['off','off-select'],'+/- '+this.lO);

                this.oMinW = this.dO.outerWidth(true);
                this.oLab = $('<h6 class="AnyTime-lbl AnyTime-lbl-off">' + this.lO + '</h6>');
                this.dO.prepend( this.oLab );

                shownFields++;
              }

            } // if ( askTime )

            //  Set the title.  If a title option has been specified, use it.
            //  Otherwise, determine a worthy title based on which (and how many)
            //  format fields have been specified.

            if ( options.labelTitle )
                this.hTitle.append( options.labelTitle );
            else if ( shownFields > 1 )
                // this.hTitle.append( 'Select a '+(askDate?(askTime?'Date and Time':'Date'):'Time') );
                this.hTitle.append( '选择 '+(askDate?(askTime?'日期时间':'日期'):'时间') );
            else
                // this.hTitle.append( 'Select' );
                this.hTitle.append( '选择' );


            //  Initialize the picker's date/time value.

            try
            {
                this.time = this.conv.parse(this.inp.val());
                this.offMin = this.conv.getUtcParseOffsetCaptured();
                this.offSI = this.conv.getUtcParseOffsetSubIndex();
                if ( 'init' in options ) // override
                this.time = this.makeDate( options.init);
            }
            catch ( e )
            {
                this.time = new Date();
            }
            // this.lastAjax = this.time;


            //  If this is a popup picker, hide it until needed.

            if ( this.pop )
            {
                this.div.hide();
                this.div.css('position','absolute');
            }

            //  Setup event listeners for the input and resize listeners for
            //  the picker.  Add the picker to the instances list (which is used
            //  to hide pickers if the user clicks off of them).

            this.inp.blur( this.hBlur =function(e){
                context.inpBlur(e);
            } );

            this.inp.click( this.hClick =function(e){
                context.showPkr(e);
            } );

            this.inp.focus( this.hFocus =function(e){
                if ( context.lostFocus )
                    context.showPkr(e);
                context.lostFocus = false;
            } );

            this.inp.keydown( this.hKeydown =function(e){
                context.key(e);
            } );

            this.inp.keypress( this.hKeypress =function(e){
                // if ( $.browser.opera && context.denyTab )
                //     e.preventDefault();
            });

            this.div.click(function(e){
                context.lostFocus = false;
                context.inp.focus();
            });

            $(window).resize( this.hResize = function(e){
                context.pos(e);
            } );

            if ( __initialized )
                this.onReady();

        }, // initialize()


        // //---------------------------------------------------------------------
        // //  .ajax() notifies the server of a value change using Ajax.
        // //---------------------------------------------------------------------

        // ajax: function()
        // {
        //     if ( this.ajaxOpts && ( this.time.getTime() != this.lastAjax.getTime() ) )
        //     {
        //       try
        //       {
        //         var opts = jQuery.extend( {}, this.ajaxOpts );
        //         if ( typeof opts.data == 'object' )
        //             opts.data[this.inp[0].name||this.inp[0].id] = this.inp.val();
        //         else
        //         {
        //             var opt = (this.inp[0].name||this.inp[0].id) + '=' + encodeURI(this.inp.val());
        //             if ( opts.data )
        //                 opts.data += '&' + opt;
        //             else
        //                 opts.data = opt;
        //         }
        //         $.ajax( opts );
        //         this.lastAjax = this.time;
        //       }
        //       catch( e )
        //       {
        //       }
        //     }
        //     return;

        // }, // .ajax()

        //---------------------------------------------------------------------
        //  .askOffset() is called by this.newOffset() when the UTC offset or
        //  +- selection button is clicked.
        //---------------------------------------------------------------------

        askOffset: function( event )
        {
            var context= this;

            if ( ! this.oDiv )
            {
              this.makeCloak();

              this.oDiv = $('<div class="AnyTime-win AnyTime-off-selector ui-widget ui-widget-content ui-corner-all"></div>');
              this.div.append(this.oDiv);

              // the order here (HDR,BODY,XDIV,TITLE) is important for width calcluation:
              var title = $('<h5 class="AnyTime-hdr AnyTime-hdr-off-selector ui-widget-header ui-corner-top" />');
              this.oDiv.append( title );
              this.oBody = $('<div class="AnyTime-body AnyTime-body-off-selector"></div>');
              this.oDiv.append( this.oBody );

              var xDiv = $('<div class="AnyTime-x-btn ui-state-default">'+this.lX+'</div>');
              title.append(xDiv);
              xDiv.click(function(e){context.dismissODiv(e);});
              title.append( this.lO );

              var cont = $('<ul class="AnyTime-off-off" />' );
              var last = null;
              this.oBody.append(cont);
              var useSubIndex = (this.oConv.fmt.indexOf('%@')>=0);
              if ( AnyTime.utcLabel )
                  for ( var o = -720 ; o <= 840 ; o++ )
                      if ( AnyTime.utcLabel[o] )
                      {
                        this.oConv.setUtcFormatOffsetAlleged(o);
                        for ( var i = 0; i < AnyTime.utcLabel[o].length; i++ )
                        {
                          this.oConv.setUtcFormatOffsetSubIndex(i);
                          last = this.btn( cont, this.oConv.format(this.time), this.newOPos, ['off-off'], o );
                          last[0].AnyTime_offMin = o;
                          last[0].AnyTime_offSI = i;
                          if ( ! useSubIndex )
                              break; // for
                        }
                      }

            if ( last )
                last.addClass('AnyTime-off-off-last-btn');

            if ( this.oDiv.outerHeight(true) > this.div.height() )
            {
                var oldW = this.oBody.width();
                this.oBody.css('height','0');
                this.oBody.css({
                    height: String(this.div.height()-(this.oDiv.outerHeight(true)+this.oBody.outerHeight(false)))+'px',
                    width: String(oldW+20)+'px' 
                }); // wider for scroll bar
            }
            if ( this.oDiv.outerWidth(true) > this.div.width() )
            {
                this.oBody.css('width','0');
                this.oBody.css('width', String(this.div.width() - (this.oDiv.outerWidth(true)+this.oBody.outerWidth(false)))+'px');
            }

            } // if ( ! this.oDiv )
            else
            {
                this.cloak.show();
                this.oDiv.show();
            }
            this.pos(event);
            this.updODiv(null);

            var f = this.oDiv.find('.AnyTime-off-off-btn.AnyTime-cur-btn:first');
            if ( ! f.length )
                f = this.oDiv.find('.AnyTime-off-off-btn:first');
            this.setFocus( f );

        }, // .askOffset()

        //---------------------------------------------------------------------
        //  .askYear() is called by this.newYear() when the yPast or yAhead
        //  button is clicked.
        //---------------------------------------------------------------------

        askYear: function( event )
        {
            var context= this;

            if ( ! this.yDiv )
            {
              this.makeCloak();

              this.yDiv = $('<div class="AnyTime-win AnyTime-yr-selector ui-widget ui-widget-content ui-corner-all"></div>');
              this.div.append(this.yDiv);

              var title = $('<h5 class="AnyTime-hdr AnyTime-hdr-yr-selector ui-widget-header ui-corner-top" />');
              this.yDiv.append( title );

              var xDiv = $('<div class="AnyTime-x-btn ui-state-default">'+this.lX+'</div>');
              title.append(xDiv);
              xDiv.click(function(e){context.dismissYDiv(e);});

              title.append( this.lY );

              var yBody = $('<div class="AnyTime-body AnyTime-body-yr-selector" ></div>');
              this.yDiv.append( yBody );

              cont = $('<ul class="AnyTime-yr-mil" />' );
              yBody.append(cont);
              this.y0XXX = this.btn( cont, 0, this.newYPos,['mil','mil0'],this.lY+' '+0+'000');
              for ( i = 1; i < 10 ; i++ )
                this.btn( cont, i, this.newYPos,['mil','mil'+i],this.lY+' '+i+'000');

              cont = $('<ul class="AnyTime-yr-cent" />' );
              yBody.append(cont);
              for ( i = 0 ; i < 10 ; i++ )
                this.btn( cont, i, this.newYPos,['cent','cent'+i],this.lY+' '+i+'00');

              cont = $('<ul class="AnyTime-yr-dec" />');
              yBody.append(cont);
              for ( i = 0 ; i < 10 ; i++ )
                this.btn( cont, i, this.newYPos,['dec','dec'+i],this.lY+' '+i+'0');

              cont = $('<ul class="AnyTime-yr-yr" />');
              yBody.append(cont);
              for ( i = 0 ; i < 10 ; i++ )
                this.btn( cont, i, this.newYPos,['yr','yr'+i],this.lY+' '+i );

              if ( this.askEra )
              {
                cont = $('<ul class="AnyTime-yr-era" />' );
                yBody.append(cont);

                this.btn( cont, this.conv.eAbbr[0],
                        function( event )
                        {
                            var t = new Date(this.time.getTime());
                            var year = t.getFullYear();
                            if ( year > 0 )
                                t.setFullYear(0-year);
                            this.set(t);
                            this.updYDiv($(event.target));
                        },
                        ['era','bce'], this.conv.eAbbr[0] );

                this.btn( cont, this.conv.eAbbr[1],
                        function( event )
                        {
                            var t = new Date(this.time.getTime());
                            var year = t.getFullYear();
                            if ( year < 0 )
                                t.setFullYear(0-year);
                            this.set(t);
                            this.updYDiv($(event.target));
                        },
                        ['era','ce'], this.conv.eAbbr[1] );

              } // if ( this.askEra )
            } // if ( ! this.yDiv )
            else
            {
              this.cloak.show();
              this.yDiv.show();
            }
            this.pos(event);
            this.updYDiv(null);
            this.setFocus( this.yDiv.find('.AnyTime-yr-btn.AnyTime-cur-btn:first') );

        }, // .askYear()

        //---------------------------------------------------------------------
        //  .inpBlur() is called when a picker's input loses focus to dismiss
        //  the popup.  A 1/3 second delay is necessary to restore focus if
        //  the div is clicked (shorter delays don't always work!)  To prevent
        //  problems cause by scrollbar focus (except in FF), focus is
        //  force-restored if the offset div is visible.
        //---------------------------------------------------------------------

        inpBlur: function(event)
        {
            var context= this;
            
            if ( this.oDiv && this.oDiv.is(":visible") )
            {
                this.inp.focus();
                return;
            }
            this.lostFocus = true;
            setTimeout(
                function()
                {
                    if ( context.lostFocus )
                    {
                        context.div.find('.AnyTime-focus-btn').removeClass('AnyTime-focus-btn ui-state-focus');
                        if ( context.pop )
                            context.dismiss(event);
                    }
                }, 334 );
        },

        //---------------------------------------------------------------------
        //  .btn() is called by AnyTime.picker() to create a <div> element
        //  containing an <a> element.  The elements are given appropriate
        //  classes based on the specified "classes" (an array of strings).
        //  The specified "text" and "title" are used for the <a> element.
        //  The "handler" is bound to click events for the <div>, which will
        //  catch bubbling clicks from the <a> as well.  The button is
        //  appended to the specified parent (jQuery), and the <div> jQuery
        //  is returned.
        //---------------------------------------------------------------------

        btn: function( parent, text, handler, classes, title )
        {
            var context= this;
            var tagName = ( (parent[0].nodeName.toLowerCase()=='ul')?'li':'td');
            var div$ = '<' + tagName +
                            ' class="AnyTime-btn';
            for ( var i = 0 ; i < classes.length ; i++ )
                div$ += ' AnyTime-' + classes[i] + '-btn';
            var div = $( div$ + ' ui-state-default">' + text + '</' + tagName + '>' );
            parent.append(div);
            div.AnyTime_title = title;

            div.click(
                function(e)
                {
                  // bind the handler to the picker so "this" is correct
                  context.tempFunc = handler;
                  context.tempFunc(e);
                });
            div.dblclick(
                function(e)
                {
                    var elem = $(this);
                    if ( elem.is('.AnyTime-off-off-btn') )
                        context.dismissODiv(e);
                    else if ( 
                        elem.is('.AnyTime-mil-btn') || 
                        elem.is('.AnyTime-cent-btn') || 
                        elem.is('.AnyTime-dec-btn') || 
                        elem.is('.AnyTime-yr-btn') || 
                        elem.is('.AnyTime-era-btn') 
                    )
                        context.dismissYDiv(e);
                    else if ( context.pop )
                        context.dismiss(e);
                });
            return div;

        }, // .btn()

        //---------------------------------------------------------------------
        //  .destroy() destroys the DOM events and elements associated with
        //  the picker so it can be deleted.
        //---------------------------------------------------------------------

        destroy: function(event)
        {
            this.inp
                .prop('readonly',this.ro)
                .off('blur',this.hBlur)
                .off('click',this.hClick)
                .off('focus',this.hFocus)
                .off('keydown',this.hKeydown)
                .off('keypress',this.hKeypress);
            $(window).off('resize',this.hResize);
            this.div.remove();
        },

        //---------------------------------------------------------------------
        //  .dismiss() dismisses a popup picker.
        //---------------------------------------------------------------------

        dismiss: function(event)
        {
            // this.ajax();
            if ( this.yDiv )
                this.dismissYDiv();
            if ( this.oDiv )
                this.dismissODiv();
            this.div.hide();
            this.lostFocus = true;
        },

        //---------------------------------------------------------------------
        //  .dismissODiv() dismisses the UTC offset selector popover.
        //---------------------------------------------------------------------

        dismissODiv: function(event)
        {
            this.oDiv.hide();
            this.cloak.hide();
            this.setFocus(this.oCur);
        },

        //---------------------------------------------------------------------
        //  .dismissYDiv() dismisses the date selector popover.
        //---------------------------------------------------------------------

        dismissYDiv: function(event)
        {
            this.yDiv.hide();
            this.cloak.hide();
            this.setFocus(this.yCur);
        },

        //---------------------------------------------------------------------
        //  .setFocus() makes a specified psuedo-button appear to get focus.
        //---------------------------------------------------------------------

        setFocus: function(btn)
        {
            if ( ! btn.hasClass('AnyTime-focus-btn') )
            {
                this.div.find('.AnyTime-focus-btn').removeClass('AnyTime-focus-btn ui-state-focus');
                this.fBtn = btn;
                btn.removeClass('ui-state-default ui-state-highlight');
                btn.addClass('AnyTime-focus-btn ui-state-default ui-state-highlight ui-state-focus');
            }
            if ( btn.hasClass('AnyTime-off-off-btn') )
            {
                var oBT = this.oBody.offset().top;
                var btnT = btn.offset().top;
                var btnH = btn.outerHeight(true);
                if ( btnT - btnH < oBT ) // move a page up
                    this.oBody.scrollTop( btnT + this.oBody.scrollTop() - ( this.oBody.innerHeight() + oBT ) + ( btnH * 2 ) );
                else if ( btnT + btnH > oBT + this.oBody.innerHeight() ) // move a page down
                    this.oBody.scrollTop( ( btnT + this.oBody.scrollTop() ) - ( oBT + btnH ) );
            }
        },

        key: function(event)
        {
            var mo;
            var t = null;
            var context = this;
            var elem = this.div.find('.AnyTime-focus-btn');
            var key = event.keyCode || event.which;
            this.denyTab = true;

            // if ( key == 16 ) // Shift
            // {
            // }
            // else 
            if ( ( key == 10 ) || ( key == 13 ) || ( key == 27 ) ) // Enter & Esc
            {
                if ( this.oDiv && this.oDiv.is(':visible') )
                    this.dismissODiv(event);
                else if ( this.yDiv && this.yDiv.is(':visible') )
                    this.dismissYDiv(event);
                else if ( this.pop )
                    this.dismiss(event);
            }
            else if ( ( key == 33 ) || ( ( key == 9 ) && event.shiftKey ) ) // PageUp & Shift+Tab
            {
                if ( this.fBtn.hasClass('AnyTime-off-off-btn') )
                {
                    if ( key == 9 )
                        this.dismissODiv(event);
                }
                else if ( this.fBtn.hasClass('AnyTime-mil-btn') )
                {
                    if ( key == 9 )
                        this.dismissYDiv(event);
                }
                else if ( this.fBtn.hasClass('AnyTime-cent-btn') )
                    this.yDiv.find('.AnyTime-mil-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-dec-btn') )
                    this.yDiv.find('.AnyTime-cent-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-yr-btn') )
                    this.yDiv.find('.AnyTime-dec-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-era-btn') )
                    this.yDiv.find('.AnyTime-yr-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.parents('.AnyTime-yrs').length )
                {
                    if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-mon-btn') )
                {
                    if ( this.dY )
                        this.yCur.triggerHandler('click');
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    if ( ( key == 9 ) && event.shiftKey ) // Shift+Tab
                    {
                        this.denyTab = false;
                        return;
                    }
                    else // PageUp
                    {
                        t = new Date(this.time.getTime());
                        if ( event.shiftKey )
                            t.setFullYear(t.getFullYear()-1);
                        else
                        {
                            mo = t.getMonth()-1;
                            if ( t.getDate() > __daysIn[mo] )
                                t.setDate(__daysIn[mo])
                            t.setMonth(mo);
                        }
                        this.keyDateChange(t);
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-hr-btn') )
                {
                    t = this.dDoM || this.dMo;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( this.dY )
                        this.yCur.triggerHandler('click');
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-min-ten-btn') )
                {
                    t = this.dH || this.dDoM || this.dMo;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( this.dY )
                        this.yCur.triggerHandler('click');
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-min-one-btn') )
                    this.dM.AnyTime_clickCurrent();
                else if ( this.fBtn.hasClass('AnyTime-sec-ten-btn') )
                {
                    if ( this.dM )
                        t = this.dM.find('.AnyTime-mins-ones');
                    else
                        t = this.dH || this.dDoM || this.dMo;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( this.dY )
                        this.yCur.triggerHandler('click');
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-sec-one-btn') )
                    this.dS.AnyTime_clickCurrent();
                else if ( this.fBtn.hasClass('AnyTime-off-btn') )
                {
                    if ( this.dS )
                        t = this.dS.find('.AnyTime-secs-ones');
                    else if ( this.dM )
                        t = this.dM.find('.AnyTime-mins-ones');
                    else
                        t = this.dH || this.dDoM || this.dMo;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( this.dY )
                        this.yCur.triggerHandler('click');
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
            }
            else if ( ( key == 34 ) || ( key == 9 ) ) // PageDown or Tab
            {
                if ( this.fBtn.hasClass('AnyTime-mil-btn') )
                    this.yDiv.find('.AnyTime-cent-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-cent-btn') )
                    this.yDiv.find('.AnyTime-dec-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-dec-btn') )
                    this.yDiv.find('.AnyTime-yr-btn.AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-yr-btn') )
                {
                    t = this.yDiv.find('.AnyTime-era-btn.AnyTime-cur-btn');
                    if ( t.length )
                        t.triggerHandler('click');
                    else if ( key == 9 )
                        this.dismissYDiv(event);
                }
                else if ( this.fBtn.hasClass('AnyTime-era-btn') )
                {
                    if ( key == 9 )
                        this.dismissYDiv(event);
                }
                else if ( this.fBtn.hasClass('AnyTime-off-off-btn') )
                {
                    if ( key == 9 )
                        this.dismissODiv(event);
                }
                else if ( this.fBtn.parents('.AnyTime-yrs').length )
                {
                    t = this.dDoM || this.dMo || this.dH || this.dM || this.dS || this.dO;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-mon-btn') )
                {
                    t = this.dDoM || this.dH || this.dM || this.dS || this.dO;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    if ( key == 9 ) // Tab
                    {
                        t = this.dH || this.dM || this.dS || this.dO;
                        if ( t )
                            t.AnyTime_clickCurrent();
                        else
                        {
                            this.denyTab = false;
                            return;
                        }
                    }
                    else // PageDown
                    {
                        t = new Date(this.time.getTime());
                        if ( event.shiftKey )
                            t.setFullYear(t.getFullYear()+1);
                        else
                        {
                            mo = t.getMonth()+1;
                            if ( t.getDate() > __daysIn[mo] )
                                t.setDate(__daysIn[mo])
                            t.setMonth(mo);
                        }
                        this.keyDateChange(t);
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-hr-btn') )
                {
                    t = this.dM || this.dS || this.dO;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-min-ten-btn') )
                    this.dM.find('.AnyTime-mins-ones .AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-min-one-btn') )
                {
                    t = this.dS || this.dO;
                    if ( t )
                        t.AnyTime_clickCurrent();
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-sec-ten-btn') )
                    this.dS.find('.AnyTime-secs-ones .AnyTime-cur-btn').triggerHandler('click');
                else if ( this.fBtn.hasClass('AnyTime-sec-one-btn') )
                {
                    if ( this.dO )
                        this.dO.AnyTime_clickCurrent();
                    else if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
                else if ( this.fBtn.hasClass('AnyTime-off-btn') )
                {
                    if ( key == 9 )
                    {
                        this.denyTab = false;
                        return;
                    }
                }
            }
            else if ( key == 35 ) // END
            {
                if ( this.fBtn.hasClass('AnyTime-mil-btn') || this.fBtn.hasClass('AnyTime-cent-btn') ||
                    this.fBtn.hasClass('AnyTime-dec-btn') || this.fBtn.hasClass('AnyTime-yr-btn') ||
                    this.fBtn.hasClass('AnyTime-era-btn') )
                {
                    t = this.yDiv.find('.AnyTime-ce-btn');
                    if ( ! t.length )
                        t = this.yDiv.find('.AnyTime-yr9-btn');
                    t.triggerHandler('click');
                }
                else if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    t = new Date(this.time.getTime());
                    t.setDate(1);
                    t.setMonth(t.getMonth()+1);
                    t.setDate(t.getDate()-1);
                    if ( event.ctrlKey )
                        t.setMonth(11);
                    this.keyDateChange(t);
                }
                else if ( this.dS )
                    this.dS.find('.AnyTime-sec9-btn').triggerHandler('click');
                else if ( this.dM )
                    this.dM.find('.AnyTime-min9-btn').triggerHandler('click');
                else if ( this.dH )
                    this.dH.find('.AnyTime-hr23-btn').triggerHandler('click');
                else if ( this.dDoM )
                    this.dDoM.find('.AnyTime-dom-btn-filled:last').triggerHandler('click');
                else if ( this.dMo )
                    this.dMo.find('.AnyTime-mon12-btn').triggerHandler('click');
                else if ( this.dY )
                    this.yAhead.triggerHandler('click');
            }
            else if ( key == 36 ) // HOME
            {
                if ( this.fBtn.hasClass('AnyTime-mil-btn') || this.fBtn.hasClass('AnyTime-cent-btn') ||
                    this.fBtn.hasClass('AnyTime-dec-btn') || this.fBtn.hasClass('AnyTime-yr-btn') ||
                    this.fBtn.hasClass('AnyTime-era-btn') )
                {
                    this.yDiv.find('.AnyTime-mil0-btn').triggerHandler('click');
                }
                else if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    t = new Date(this.time.getTime());
                    t.setDate(1);
                    if ( event.ctrlKey )
                        t.setMonth(0);
                    this.keyDateChange(t);
                }
                else if ( this.dY )
                    this.yCur.triggerHandler('click');
                else if ( this.dMo )
                    this.dMo.find('.AnyTime-mon1-btn').triggerHandler('click');
                else if ( this.dDoM )
                    this.dDoM.find('.AnyTime-dom-btn-filled:first').triggerHandler('click');
                else if ( this.dH )
                    this.dH.find('.AnyTime-hr0-btn').triggerHandler('click');
                else if ( this.dM )
                    this.dM.find('.AnyTime-min00-btn').triggerHandler('click');
                else if ( this.dS )
                    this.dS.find('.AnyTime-sec00-btn').triggerHandler('click');
            }
            else if ( key == 37 ) // left arrow
            {
                if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    t = new Date(this.time.getTime());
                    t.setDate(t.getDate()-1);
                    this.keyDateChange(t);
                }
                else
                    this.keyBack();
            }
            else if ( key == 38 ) // up arrow
            {
                if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    t = new Date(this.time.getTime());
                    t.setDate(t.getDate()-7);
                    this.keyDateChange(t);
                }
                else
                    this.keyBack();
            }
            else if ( key == 39 ) // right arrow
            {
                if ( this.fBtn.hasClass('AnyTime-dom-btn') )
                {
                    t = new Date(this.time.getTime());
                    t.setDate(t.getDate()+1);
                    this.keyDateChange(t);
                }
                else
                    this.keyAhead();
            }
            else if ( key == 40 ) // down arrow
            {
                if ( this.fBtn.hasClass('AnyTime-dom-btn') )
            {
                  t = new Date(this.time.getTime());
            t.setDate(t.getDate()+7);
                    this.keyDateChange(t);
            }
                else
                    this.keyAhead();
            }
            else if ( ( ( key == 86 ) || ( key == 118 ) ) && event.ctrlKey )
            {
                this.updVal('');
                setTimeout( function() { context.showPkr(null); }, 100 );
                return;
            }
            else
                this.showPkr(null);

            event.preventDefault();
        }, // .key()

        //---------------------------------------------------------------------
        //  .keyAhead() is called by #key when a user presses the right or
        //  down arrow.  It moves to the next appropriate button.
        //---------------------------------------------------------------------

        keyAhead: function()
        {
            if ( this.fBtn.hasClass('AnyTime-mil9-btn') )
                this.yDiv.find('.AnyTime-cent0-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-cent9-btn') )
                this.yDiv.find('.AnyTime-dec0-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-dec9-btn') )
                this.yDiv.find('.AnyTime-yr0-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-yr9-btn') )
                this.yDiv.find('.AnyTime-bce-btn').triggerHandler('click');
            // else if ( this.fBtn.hasClass('AnyTime-sec9-btn') )
            //     {}
            else if ( this.fBtn.hasClass('AnyTime-sec50-btn') ){
                this.dS.find('.AnyTime-sec0-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-min9-btn') )
            {
                if ( this.dS )
                    this.dS.find('.AnyTime-sec00-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-min50-btn') ){
                this.dM.find('.AnyTime-min0-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-hr23-btn') )
            {
                if ( this.dM )
                    this.dM.find('.AnyTime-min00-btn').triggerHandler('click');
                else if ( this.dS )
                    this.dS.find('.AnyTime-sec00-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-hr11-btn') ){
                this.dH.find('.AnyTime-hr12-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-mon12-btn') )
            {
                if ( this.dDoM )
                    this.dDoM.AnyTime_clickCurrent();
                else if ( this.dH )
                    this.dH.find('.AnyTime-hr0-btn').triggerHandler('click');
                else if ( this.dM )
                    this.dM.find('.AnyTime-min00-btn').triggerHandler('click');
                else if ( this.dS )
                    this.dS.find('.AnyTime-sec00-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-yrs-ahead-btn') )
            {
                if ( this.dMo )
                    this.dMo.find('.AnyTime-mon1-btn').triggerHandler('click');
                else if ( this.dH )
                    this.dH.find('.AnyTime-hr0-btn').triggerHandler('click');
                else if ( this.dM )
                    this.dM.find('.AnyTime-min00-btn').triggerHandler('click');
                else if ( this.dS )
                    this.dS.find('.AnyTime-sec00-btn').triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-yr-cur-btn') ){
                this.yNext.triggerHandler('click');
            }
            else {
                 this.fBtn.next().triggerHandler('click');
            }
        }, // .keyAhead()


        //---------------------------------------------------------------------
        //  .keyBack() is called by #key when a user presses the left or
        //  up arrow. It moves to the previous appropriate button.
        //---------------------------------------------------------------------

        keyBack: function()
        {
            if ( this.fBtn.hasClass('AnyTime-cent0-btn') )
                this.yDiv.find('.AnyTime-mil9-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-dec0-btn') )
                this.yDiv.find('.AnyTime-cent9-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-yr0-btn') )
                this.yDiv.find('.AnyTime-dec9-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-bce-btn') )
                    this.yDiv.find('.AnyTime-yr9-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-yr-cur-btn') )
                this.yPrior.triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-mon1-btn') )
            {
                if ( this.dY )
                    this.yCur.triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-hr0-btn') )
            {
                if ( this.dDoM )
                    this.dDoM.AnyTime_clickCurrent();
                else if ( this.dMo )
                    this.dMo.find('.AnyTime-mon12-btn').triggerHandler('click');
                else if ( this.dY )
                    this.yNext.triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-hr12-btn') )
                 this.dH.find('.AnyTime-hr11-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-min00-btn') )
            {
                if ( this.dH )
                    this.dH.find('.AnyTime-hr23-btn').triggerHandler('click');
                else if ( this.dDoM )
                    this.dDoM.AnyTime_clickCurrent();
                else if ( this.dMo )
                    this.dMo.find('.AnyTime-mon12-btn').triggerHandler('click');
                else if ( this.dY )
                    this.yNext.triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-min0-btn') )
                 this.dM.find('.AnyTime-min50-btn').triggerHandler('click');
            else if ( this.fBtn.hasClass('AnyTime-sec00-btn') )
            {
                if ( this.dM )
                    this.dM.find('.AnyTime-min9-btn').triggerHandler('click');
                else if ( this.dH )
                    this.dH.find('.AnyTime-hr23-btn').triggerHandler('click');
                else if ( this.dDoM )
                    this.dDoM.AnyTime_clickCurrent();
                else if ( this.dMo )
                    this.dMo.find('.AnyTime-mon12-btn').triggerHandler('click');
                else if ( this.dY )
                    this.yNext.triggerHandler('click');
            }
            else if ( this.fBtn.hasClass('AnyTime-sec0-btn') )
                 this.dS.find('.AnyTime-sec50-btn').triggerHandler('click');
            else
                 this.fBtn.prev().triggerHandler('click');
        }, // .keyBack()

        //---------------------------------------------------------------------
        //  .keyDateChange() is called by #key when an direction key
        //  (arrows/page/etc) is pressed while the Day-of-Month calendar has
        //  focus. The current day is adjusted accordingly.
        //---------------------------------------------------------------------

        keyDateChange: function( newDate )
        {
            if ( this.fBtn.hasClass('AnyTime-dom-btn') )
            {
                this.set(newDate);
                this.upd(null);
                this.setFocus( this.dDoM.find('.AnyTime-cur-btn') );
            }
        },

        //---------------------------------------------------------------------
        //  .makeCloak() is called by .askOffset() and .askYear() to create
        //  a cloak div.
        //---------------------------------------------------------------------

        makeCloak: function()
        {
            var context= this;
            if ( ! this.cloak )
            {
              this.cloak = $('<div class="AnyTime-cloak"></div>');
              this.div.append( this.cloak );
              this.cloak.click(
                function(e)
                {
                    if ( context.oDiv && context.oDiv.is(":visible") )
                        context.dismissODiv(e);
                    else
                        context.dismissYDiv(e);
                });
            }
            else
                this.cloak.show();
        },

        //---------------------------------------------------------------------
        //  makeDate() returns a Date object for the parameter as follows.
        //  Strings are parsed using the converter and numbers are assumed
        //  to be milliseconds.
        //---------------------------------------------------------------------

        makeDate: function(time)
        {
          if ( typeof time == 'number' )
            time = new Date(time);
          else if ( typeof time == 'string' )
            time = this.conv.parse( time );
          if ( 'getTime' in time )
            return time;
          throw 'cannot make a Date from ' + time;
        },

        //---------------------------------------------------------------------
        //  .newHour() is called when a user clicks an hour value.
        //  It changes the date and updates the text field.
        //---------------------------------------------------------------------

        newHour: function( event )
        {
            var h;
            var t;
            var elem = $(event.target);
            if ( elem.hasClass("AnyTime-out-btn") )
                return;
            if ( ! this.twelveHr )
              h = Number(elem.text());
            else
            {
              var str = elem.text();
              t = str.indexOf('a');
              if ( t < 0 )
              {
                t = Number(str.substr(0,str.indexOf('p')));
                h = ( (t==12) ? 12 : (t+12) );
              }
              else
              {
                t = Number(str.substr(0,t));
                h = ( (t==12) ? 0 : t );
              }
            }
            t = new Date(this.time.getTime());
            t.setHours(h);
            this.set(t);
            this.upd(elem);

        }, // .newHour()

        //---------------------------------------------------------------------
        //  .newOffset() is called when a user clicks the UTC offset (timezone)
        //  (or +/- button) to shift the year.  It changes the date and updates
        //  the text field.
        //---------------------------------------------------------------------

        newOffset: function( event )
        {
            if ( event.target == this.oSel[0] )
                this.askOffset(event);
            else
            {
              this.upd(this.oCur);
            }
        },

        //---------------------------------------------------------------------
        //  .newOPos() is called internally whenever a user clicks an offset
        //  selection value.  It changes the date and updates the text field.
        //---------------------------------------------------------------------

        newOPos: function( event )
        {
            var elem = $(event.target);
            this.offMin = elem[0].AnyTime_offMin;
            this.offSI = elem[0].AnyTime_offSI;
            var t = new Date(this.time.getTime());
            this.set(t);
            this.updODiv(elem);

        }, // .newOPos()

        //---------------------------------------------------------------------
        //  .newYear() is called when a user clicks a year (or one of the
        //  "arrows") to shift the year.  It changes the date and updates the
        //  text field.
        //---------------------------------------------------------------------

        newYear: function( event )
        {
            var elem = $(event.target);
            if ( elem.hasClass("AnyTime-out-btn") )
                return;
            var txt = elem.text();
            if ( ( txt == '<' ) || ( txt == '&lt;' ) )
              this.askYear(event);
            else if ( ( txt == '>' ) || ( txt == '&gt;' ) )
              this.askYear(event);
            else
            {
              var t = new Date(this.time.getTime());
              t.setFullYear(Number(txt));
              this.set(t);
              this.upd(this.yCur);
            }
        },

        //---------------------------------------------------------------------
        //  .newYPos() is called internally whenever a user clicks a year
        //  selection value.  It changes the date and updates the text field.
        //---------------------------------------------------------------------

        newYPos: function( event )
        {
            var elem = $(event.target);
            if ( elem.hasClass("AnyTime-out-btn") )
                return;

            var era = 1;
            var year = this.time.getFullYear();
            if ( year < 0 )
            {
              era = (-1);
              year = 0 - year;
            }
            year = pad( year, 4 );
            if ( elem.hasClass('AnyTime-mil-btn') )
              year = elem.html() + year.substring(1,4);
            else if ( elem.hasClass('AnyTime-cent-btn') )
              year = year.substring(0,1) + elem.html() + year.substring(2,4);
            else if ( elem.hasClass('AnyTime-dec-btn') )
              year = year.substring(0,2) + elem.html() + year.substring(3,4);
            else
              year = year.substring(0,3) + elem.html();
            if ( year == '0000' )
              year = 1;
            var t = new Date(this.time.getTime());
            t.setFullYear( era * year );
            this.set(t);
            this.updYDiv(elem);

        }, // .newYPos()

        //---------------------------------------------------------------------
        //  .onReady() initializes the picker after the page has loaded.
        //---------------------------------------------------------------------

        onReady: function()
        {
            this.lostFocus = true;
            if ( ! this.pop )
                this.upd(null);
            else
            {
                if ( this.div.parent() != document.body )
                    this.div.appendTo( document.body );
            }
        },

        //---------------------------------------------------------------------
        //  .pos() positions the picker, such as when it is displayed or
        //  when the window is resized.
        //---------------------------------------------------------------------

        pos: function(event) // note: event is ignored but this is a handler
        {
            if ( this.pop )
            {
              var off = this.inp.offset();
              var bodyWidth = $(document.body).outerWidth(true);
              var pickerWidth = this.div.outerWidth(true);
              var left = off.left;
              if ( left + pickerWidth > bodyWidth - 20 )
                left = bodyWidth - ( pickerWidth + 20 );
              var top = off.top - this.div.outerHeight(true);
              if ( top < 0 )
                top = off.top + this.inp.outerHeight(true);
              this.div.css( { top: String(top)+'px', left: String(left<0?0:left)+'px' } );
            }

            var wOff = this.div.offset();

            if ( this.oDiv && this.oDiv.is(":visible") )
            {
              var oOff = this.oLab.offset();
              if ( this.div.css('position') == 'absolute' )
              {
                  oOff.top -= wOff.top;
                  oOff.left = oOff.left - wOff.left;
                  wOff = { top: 0, left: 0 };
              }
              var oW = this.oDiv.outerWidth(true);
              var wW = this.div.outerWidth(true);
              if ( oOff.left + oW > wOff.left + wW )
              {
                  oOff.left = (wOff.left+wW)-oW;
                  if ( oOff.left < 2 )
                      oOff.left = 2;
              }

              var oH = this.oDiv.outerHeight(true);
              var wH = this.div.outerHeight(true);
              oOff.top += this.oLab.outerHeight(true);
              if ( oOff.top + oH > wOff.top + wH )
                  oOff.top = oOff.top - oH;
              if ( oOff.top < wOff.top )
                  oOff.top = wOff.top;

              this.oDiv.css( { top: oOff.top+'px', left: oOff.left+'px' } ) ;
            }

            else if ( this.yDiv && this.yDiv.is(":visible") )
            {
              var yOff = this.yLab.offset();
              if ( this.div.css('position') == 'absolute' )
              {
                  yOff.top -= wOff.top;
                  yOff.left = yOff.left - wOff.left;
                  wOff = { top: 0, left: 0 };
              }
              yOff.left += ( (this.yLab.outerWidth(true)-this.yDiv.outerWidth(true)) / 2 );
              this.yDiv.css( { top: yOff.top+'px', left: yOff.left+'px' } ) ;
            }

            if ( this.cloak )
              this.cloak.css( {
                top: wOff.top+'px',
                left: wOff.left+'px',
                height: String(this.div.outerHeight(true)-2)+'px',
                width: String(this.div.outerWidth(true)-2)+'px'
                } );

        }, // .pos()

        //---------------------------------------------------------------------
        //  .set() changes the current time.  It returns true if the new
        //  time is within the allowed range (if any).
        //---------------------------------------------------------------------

        set: function(newTime)
        {
            var t = newTime.getTime();
            if ( this.earliest && ( t < this.earliest.getTime() ) )
              this.time = new Date(this.earliest.getTime());
            else if ( this.latest && ( t > this.latest.getTime() ) )
              this.time = new Date(this.latest.getTime());
            else
              this.time = newTime;
        },

        //---------------------------------------------------------------------
        //  .setCurrent() changes the current time.
        //---------------------------------------------------------------------

        setCurrent: function(newTime)
        {
            this.set(this.makeDate(newTime));
            this.upd(null);
        },

        //---------------------------------------------------------------------
        //  .setEarliest() changes the earliest time.
        //---------------------------------------------------------------------

        setEarliest: function(newTime)
        {
            this.earliest = this.makeDate( newTime );
            this.set(this.time);
            this.upd(null);
        },

        //---------------------------------------------------------------------
        //  .setLatest() changes the latest time.
        //---------------------------------------------------------------------

        setLatest: function(newTime)
        {
            this.latest = this.makeDate( newTime );
            this.set(this.time);
            this.upd(null);
        },

        //---------------------------------------------------------------------
        //  .showPkr() displays the picker and sets the focus psuedo-
        //  element. The current value in the input field is used to initialize
        //  the picker.
        //---------------------------------------------------------------------

        showPkr: function(event)
        {
            try
            {
                this.time = this.conv.parse(this.inp.val());
                this.offMin = this.conv.getUtcParseOffsetCaptured();
                this.offSI = this.conv.getUtcParseOffsetSubIndex();
            }
            catch ( e )
            {
                this.time = new Date();
            }
            this.set(this.time);
            this.upd(null);

            var fBtn = null;
            var cb = '.AnyTime-cur-btn:first';
            if ( this.dDoM )
                fBtn = this.dDoM.find(cb);
            else if ( this.yCur )
                fBtn = this.yCur;
            else if ( this.dMo )
                fBtn = this.dMo.find(cb);
            else if ( this.dH )
                fBtn = this.dH.find(cb);
            else if ( this.dM )
                fBtn = this.dM.find(cb);
            else if ( this.dS )
                fBtn = this.dS.find(cb);

            this.setFocus(fBtn);
            this.pos(event);

        }, // .showPkr()

        //---------------------------------------------------------------------
        //  .upd() updates the picker's appearance.  It is called after
        //  most events to make the picker reflect the currently-selected
        //  values. fBtn is the psuedo-button to be given focus.
        //---------------------------------------------------------------------

        upd: function(fBtn)
        {
            var context= this;

            var cmpLo = new Date(this.time.getTime());
            cmpLo.setMonth(0,1);
            cmpLo.setHours(0,0,0,0);
            var cmpHi = new Date(this.time.getTime());
            cmpHi.setMonth(11,31);
            cmpHi.setHours(23,59,59,999);
            var earliestTime = this.earliest && this.earliest.getTime();
            var latestTime = this.latest && this.latest.getTime();

            //  Update year.

            var current = this.time.getFullYear();
            if ( this.earliest && this.yPast )
            {
                cmpHi.setFullYear(current-2);
                if ( cmpHi.getTime() < this.earliestTime )
                    this.yPast.addClass('AnyTime-out-btn ui-state-disabled');
                else
                    this.yPast.removeClass('AnyTime-out-btn ui-state-disabled');
            }
            if ( this.yPrior )
            {
                this.yPrior.text(pad((current==1)?(-1):(current-1),4));
                if ( this.earliest )
                {
                    cmpHi.setFullYear(current-1);
                    if ( cmpHi.getTime() < this.earliestTime )
                        this.yPrior.addClass('AnyTime-out-btn ui-state-disabled');
                    else
                        this.yPrior.removeClass('AnyTime-out-btn ui-state-disabled');
                }
            }
            if ( this.yCur )
                this.yCur.text(pad(current,4));
            if ( this.yNext )
            {
                this.yNext.text(pad((current==-1)?1:(current+1),4));
                if ( this.latest )
                {
                    cmpLo.setFullYear(current+1);
                    if ( cmpLo.getTime() > this.latestTime )
                        this.yNext.addClass('AnyTime-out-btn ui-state-disabled');
                    else
                        this.yNext.removeClass('AnyTime-out-btn ui-state-disabled');
                }
            }
            if ( this.latest && this.yAhead )
            {
                  cmpLo.setFullYear(current+2);
                  if ( cmpLo.getTime() > this.latestTime )
                      this.yAhead.addClass('AnyTime-out-btn ui-state-disabled');
                  else
                      this.yAhead.removeClass('AnyTime-out-btn ui-state-disabled');
            }

            //  Update month.

            cmpLo.setFullYear( this.time.getFullYear() );
            cmpHi.setFullYear( this.time.getFullYear() );
            var i = 0;
            current = this.time.getMonth();
            $('#'+this.id+' .AnyTime-mon-btn').each(function(){
                cmpLo.setMonth(i);
                cmpHi.setDate(1);
                cmpHi.setMonth(i+1);
                cmpHi.setDate(0);
                // $(this).AnyTime_current( 
                //         i == current,
                //         ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                //         ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                $(this).AnyTime_current( 
                        i == current,
                        ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                        ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                i++;
            } );

            //  Update days.

            cmpLo.setFullYear( this.time.getFullYear() );
            cmpHi.setFullYear( this.time.getFullYear() );
            cmpLo.setMonth( this.time.getMonth() );
            cmpHi.setMonth( this.time.getMonth(), 1 );
            current = this.time.getDate();
            var currentMonth = this.time.getMonth();
            var lastLoDate = -1;
            var dow1 = cmpLo.getDay();
            if ( this.fDOW > dow1 )
                dow1 += 7;
            var wom = 0, dow=0;
            $('#'+this.id+' .AnyTime-wk').each(function(){
                dow = context.fDOW;
                $(this).children().each(function(){
                    if ( dow - context.fDOW < 7 )
                    {
                        var td = $(this);
                        if ( ((wom===0)&&(dow<dow1)) || (cmpLo.getMonth()!=currentMonth) )
                        {
                            td.html('&#160;');
                            td.removeClass('AnyTime-dom-btn-filled AnyTime-cur-btn ui-state-default ui-state-highlight');
                            td.addClass('AnyTime-dom-btn-empty');
                            if ( wom ) // not first week
                            {
                                if ( ( cmpLo.getDate() === 1 ) && ( dow !== 0 ) )
                                    td.addClass('AnyTime-dom-btn-empty-after-filled');
                                else
                                    td.removeClass('AnyTime-dom-btn-empty-after-filled');
                                if ( cmpLo.getDate() <= 7 )
                                    td.addClass('AnyTime-dom-btn-empty-below-filled');
                                else
                                    td.removeClass('AnyTime-dom-btn-empty-below-filled');
                                cmpLo.setDate(cmpLo.getDate()+1);
                                cmpHi.setDate(cmpHi.getDate()+1);
                            }
                            else // first week
                            {
                                td.addClass('AnyTime-dom-btn-empty-above-filled');
                                if ( dow == dow1 - 1 )
                                    td.addClass('AnyTime-dom-btn-empty-before-filled');
                                else
                                    td.removeClass('AnyTime-dom-btn-empty-before-filled');
                            }
                            td.addClass('ui-state-default ui-state-disabled');
                        }
                        else
                        {
                            // Brazil daylight savings time sometimes results in
                            // midnight being the same day twice. This skips the
                            //  second one.
                            if ( ( i = cmpLo.getDate() ) == lastLoDate )
                                cmpLo.setDate( ++i );
                            lastLoDate = i;

                            td.text(i);
                            td.removeClass('AnyTime-dom-btn-empty AnyTime-dom-btn-empty-above-filled AnyTime-dom-btn-empty-before-filled '+
                                            'AnyTime-dom-btn-empty-after-filled AnyTime-dom-btn-empty-below-filled ' +
                                            'ui-state-default ui-state-disabled');
                            td.addClass('AnyTime-dom-btn-filled ui-state-default');
                            td.AnyTime_current( i == current,
                                ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                                ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                            cmpLo.setDate(i+1);
                            cmpHi.setDate(i+1);
                        }
                    }
                    dow++;
                } );
                wom++;
            } );

            //  Update hour.

            cmpLo.setFullYear( this.time.getFullYear() );
            cmpHi.setFullYear( this.time.getFullYear() );
            cmpLo.setMonth( this.time.getMonth(), this.time.getDate() );
            cmpHi.setMonth( this.time.getMonth(), this.time.getDate() );
            var not12 = ! this.twelveHr;
            var hr = this.time.getHours();
            $('#'+this.id+' .AnyTime-hr-btn').each(function(){
                var html = this.innerHTML;
                var i;
                if ( not12 )
                    i = Number(html);
                else
                {
                    i = Number(html.substring(0,html.length-2) );
                    if ( html.charAt(html.length-2) == 'a' )
                    {
                      if ( i == 12 )
                          i = 0;
                    }
                    else if ( i < 12 )
                        i += 12;
                }
                cmpLo.setHours(i);
                cmpHi.setHours(i);
                $(this).AnyTime_current( hr == i,
                    ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                        ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
               if ( i < 23 )
                  cmpLo.setHours( cmpLo.getHours()+1 );
            } );

            //  Update minute.

            cmpLo.setHours( this.time.getHours() );
            cmpHi.setHours( this.time.getHours(), 9 );
            var units = this.time.getMinutes();
            var tens = String(Math.floor(units/10));
            var ones = String(units % 10);
            $('#'+this.id+' .AnyTime-min-ten-btn:not(.AnyTime-min-ten-btn-empty)').each(function(){
                $(this).AnyTime_current( this.innerHTML == tens,
                        ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                        ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                if ( cmpLo.getMinutes() < 50 )
                {
                    cmpLo.setMinutes( cmpLo.getMinutes()+10 );
                    cmpHi.setMinutes( cmpHi.getMinutes()+10 );
                }
            } );
            cmpLo.setMinutes( Math.floor(this.time.getMinutes()/10)*10 );
            cmpHi.setMinutes( Math.floor(this.time.getMinutes()/10)*10 );
            $('#'+this.id+' .AnyTime-min-one-btn:not(.AnyTime-min-one-btn-empty)').each(function(){
                $(this).AnyTime_current( this.innerHTML == ones,
                        ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                        ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                cmpLo.setMinutes( cmpLo.getMinutes()+1 );
                cmpHi.setMinutes( cmpHi.getMinutes()+1 );
            } );

            //  Update second.

            cmpLo.setMinutes( this.time.getMinutes() );
            cmpHi.setMinutes( this.time.getMinutes(), 9 );
            units = this.time.getSeconds();
            tens = String(Math.floor(units/10));
            ones = String(units % 10);
            $('#'+this.id+' .AnyTime-sec-ten-btn:not(.AnyTime-sec-ten-btn-empty)').each(function(){
                $(this).AnyTime_current( 
                    this.innerHTML == tens,
                    ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                    ((!context.latest)||(cmpLo.getTime()<=latestTime)) 
                );
                if ( cmpLo.getSeconds() < 50 ){
                    cmpLo.setSeconds( cmpLo.getSeconds()+10 );
                    cmpHi.setSeconds( cmpHi.getSeconds()+10 );
                }
            } );
            cmpLo.setSeconds( Math.floor(this.time.getSeconds()/10)*10 );
            cmpHi.setSeconds( Math.floor(this.time.getSeconds()/10)*10 );
            $('#'+this.id+' .AnyTime-sec-one-btn:not(.AnyTime-sec-one-btn-empty)').each(function(){
                $(this).AnyTime_current( this.innerHTML == ones,
                    ((!context.earliest)||(cmpHi.getTime()>=earliestTime)) &&
                    ((!context.latest)||(cmpLo.getTime()<=latestTime)) );
                cmpLo.setSeconds( cmpLo.getSeconds()+1 );
                cmpHi.setSeconds( cmpHi.getSeconds()+1 );
            } );

            //  Update offset (time zone).

            if ( this.oConv )
            {
                this.oConv.setUtcFormatOffsetAlleged(this.offMin);
                this.oConv.setUtcFormatOffsetSubIndex(this.offSI);
                var tzs = this.oConv.format(this.time);
                this.oCur.html( tzs );
            }

            //  Set the focus element, then size the picker according to its
            //  components, show the changes, and invoke Ajax if desired.

            if ( fBtn )
                this.setFocus(fBtn);

            this.conv.setUtcFormatOffsetAlleged(this.offMin);
            this.conv.setUtcFormatOffsetSubIndex(this.offSI);
            this.updVal(this.conv.format(this.time));
            this.div.show();

            if ( this.dO ) // fit offset button
            {
                this.oCur.css('width','0');
                var curW = this.dT.width()-this.oMinW;
                if ( curW < 40 )
                    curW = 40;
                this.oCur.css('width',String(curW)+'px');
            }

            // if ( ! this.pop )
            //     this.ajax();

        }, // .upd()

        //---------------------------------------------------------------------
        //  .updODiv() updates the UTC offset selector's appearance.  It is
        //  called after most events to make the picker reflect the currently-
        //  selected values. fBtn is the psuedo-button to be given focus.
        //---------------------------------------------------------------------

        updODiv: function(fBtn)
        {
            var context= this;

            var cur, matched = false, def = null;
            this.oDiv.find('.AnyTime-off-off-btn').each(function(){
                if ( this.AnyTime_offMin == context.offMin )
                {
                    if ( this.AnyTime_offSI == context.offSI )
                        $(this).AnyTime_current(matched=true,true);
                    else
                    {
                        $(this).AnyTime_current(false,true);
                        if ( def == null )
                        def = $(this);
                    }
                }
                else
                    $(this).AnyTime_current(false,true);
            } );
            if ( ( ! matched ) && ( def != null ) )
                def.AnyTime_current(true,true);

            //  Show change

            this.conv.setUtcFormatOffsetAlleged(this.offMin);
            this.conv.setUtcFormatOffsetSubIndex(this.offSI);
            this.updVal(this.conv.format(this.time));
            this.upd(fBtn);

        }, // .updODiv()

        //---------------------------------------------------------------------
        //  .updYDiv() updates the year selector's appearance.  It is
        //  called after most events to make the picker reflect the currently-
        //  selected values. fBtn is the psuedo-button to be given focus.
        //---------------------------------------------------------------------

        updYDiv: function(fBtn)
        {
            var context= this;

            var i, legal;
            var era = 1;
            var yearValue = this.time.getFullYear();
            if ( yearValue < 0 )
            {
                era = (-1);
                yearValue = 0 - yearValue;
            }
            yearValue = pad( yearValue, 4 );
            var eY = this.earliest && this.earliest.getFullYear();
            var lY = this.latest && this.latest.getFullYear();

            i = 0;
            this.yDiv.find('.AnyTime-mil-btn').each(function(){
                legal = ( ((!context.earliest)||(era*(i+(era<0?0:999))>=eY)) && ((!context.latest)||(era*(i+(era>0?0:999))<=lY)) );
                $(this).AnyTime_current( this.innerHTML == yearValue.substring(0,1), legal );
                i += 1000;
            } );

            i = (Math.floor(yearValue/1000)*1000);
            this.yDiv.find('.AnyTime-cent-btn').each(function(){
                legal = ( ((!context.earliest)||(era*(i+(era<0?0:99))>=eY)) && ((!context.latest)||(era*(i+(era>0?0:99))<=lY)) );
                $(this).AnyTime_current( this.innerHTML == yearValue.substring(1,2), legal );
                i += 100;
            } );

            i = (Math.floor(yearValue/100)*100);
            this.yDiv.find('.AnyTime-dec-btn').each(function(){
                legal = ( ((!context.earliest)||(era*(i+(era<0?0:9))>=eY)) && ((!context.latest)||(era*(i+(era>0?0:9))<=lY)) );
                $(this).AnyTime_current( this.innerHTML == yearValue.substring(2,3), legal );
                i += 10;
            } );

            i = (Math.floor(yearValue/10)*10);
            this.yDiv.find('.AnyTime-yr-btn').each(function(){
                legal = ( ((!context.earliest)||(era*i>=eY)) && ((!context.latest)||(era*i<=lY)) );
                $(this).AnyTime_current( this.innerHTML == yearValue.substring(3), legal );
                i += 1;
            } );

            this.yDiv.find('.AnyTime-bce-btn').each(function(){
                $(this).AnyTime_current( era < 0, (!context.earliest) || ( context.earliest.getFullYear() < 0 ) );
            } );
            this.yDiv.find('.AnyTime-ce-btn').each(function(){
                $(this).AnyTime_current( era > 0, (!context.latest) || ( context.latest.getFullYear() > 0 ) );
            } );

            //  Show change

            this.conv.setUtcFormatOffsetAlleged(this.offMin);
            this.conv.setUtcFormatOffsetSubIndex(this.offSI);
            this.updVal(this.conv.format(this.time));
            this.upd(fBtn);

        }, // .updYDiv()

        //---------------------------------------------------------------------
        //  .updVal() updates the input value, but only if it's different
        //  than the previous value. It also triggers a change() event if
        //  the value is updated.
        //---------------------------------------------------------------------

        updVal: function(val)
        {
            if ( this.inp.val() != val ) {
                this.inp.val(val);
                this.inp.change();
            }
        }
    });

    // TODO: need to remove
    $.fn.AnyTime_current = function(isCurrent,isLegal)
    {
        if ( isCurrent )
        {
          this.removeClass('AnyTime-out-btn ui-state-default ui-state-disabled ui-state-highlight');
          this.addClass('AnyTime-cur-btn ui-state-default ui-state-highlight');
        }
        else
        {
          this.removeClass('AnyTime-cur-btn ui-state-highlight');
          if ( ! isLegal ){
            this.addClass('AnyTime-out-btn ui-state-disabled');
          }
          else{
            this.removeClass('AnyTime-out-btn ui-state-disabled');
          }
        }
    };
});


/* anytime javascript jQuery */

(function($) {
    // 严格模式
    'use strict';

    // 控件类名
    var pluginName = 'anytime';
    var PluginClass=T.UI.Controls.Anytime;

    var pluginRef = 't-plugin-ref';
    // 胶水代码
    $.fn[pluginName] = function(options) {

        this.each(function () {
            if(options === 'destroy'){
                jqElement.data(pluginRef).destroy();
                jqElement.data(pluginRef).remove();
                return;
            }

            var jqElement=$(this);
            var plugin = jqElement.data(pluginRef);
            if(plugin === undefined)
            {
                plugin=new PluginClass(this, $.extend(true, {}, options));
                jqElement.data(pluginRef, plugin);
            }
        });

        return this;
    };
})(jQuery);

