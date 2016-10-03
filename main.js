$(function() {

    $('#datebtn').datepicker({
        format: "dd/mm/yyyy",
        calendarWeeks: true,
        keyboardNavigation: false,
        todayHighlight: true,
        weekStart: 1
    })
        .on('changeDate', function(e) {

            console.log(e.date);

            //var formdate = moment.utc($(this).val() + " 13:00", "DD/MM/YYYY hh:mm", true);
            var formdate = moment(e.date);
            $('#date').val(formdate.format("DD/MM/YYYY"))
            $('#date').trigger('keyup');
        });

    $('#date').on('keyup', function() {
        var formdate = moment( $(this).val(), "DD/MM/YYYY", true );

        if (!formdate.isValid() || formdate.year() < 2016 || formdate.year() > 2017) {
            $(this).parent().addClass('has-error');
        } else {
            $(this).parent().removeClass('has-error');
            location.hash = '#' + formdate.format("DDMMYYYY");
            $('#datebtn').datepicker('update', formdate.format("DD/MM/YYYY"));
        }
        $('#datebtn').datepicker('hide');
        update(formdate);
    });

    var local = moment();
    var utc = moment.utc();

    $('#local-now').text( local.format("dddd, D MMMM YYYY, h:mm a (Z)") );
    $('#utc-now').text( utc.format("dddd, D MMMM YYYY, h:mm a (Z)") );

    function update(ts) {

        console.log(ts), ts.format("ww");

        if (!ts.isValid() || ts.year() < 2016 || ts.year() > 2017) {
            $('.week-field').text("");
            return;
        }

        //Prepend year as a hack to make gregorian week number grow across new year
        var year = "" + ts.format("YY");
        var gregWeek = parseInt(ts.format("WW"));
        $('#week-gregorian').text( gregWeek );

        var syllabusWeek;
        if (year == 16) {
            syllabusWeek = gregWeek - 29;
        } else if (year == 17) {
            syllabusWeek = gregWeek + 23;
        }

        console.log(gregWeek);

        //OLD: Syllabus 2013/14 starts on Mon 29 Jul (week 31)
        //NEW Syllabus 2016/17 starts on Mon 25 Jul
        var before = moment("25/07/2016", "DD/MM/YYYY", true);
        var after = moment("21/07/2017", "DD/MM/YYYY", true);

        console.log(before);
        console.log(after);
        console.log(ts);

        console.log(before.diff(ts, 'days',true));
        console.log(after.diff(ts, 'days',true));

        if ( before.diff(ts) > 0
            || after.diff(ts) < 0) {
            $('#week-syllabus').text( "Not in 2016-17 timetable");
        } else {
            $('#week-syllabus').text( syllabusWeek );
        }

        //Durham weeks
        var durhamWeek;
        var durhamWeekText;
        if (between(syllabusWeek, 11, 21))
        {
            durhamWeekText = "Michaelmas Week";
            durhamWeek = syllabusWeek - 10;
        }
        else if (between(syllabusWeek, 26, 34))
        {
            durhamWeekText = "Epiphany Week";
            durhamWeek = syllabusWeek - 25;
        }
        else if (between(syllabusWeek, 40, 48))
        {
            durhamWeekText = "Easter Week";
            durhamWeek = syllabusWeek - 39;
        } else {
            durhamWeekText = "N/A (or holiday)";
            durhamWeek = "";
        }
        $('#week-durham').text(durhamWeekText + " " + durhamWeek)

        //Teaching Weeks
        var teachingWeek;
        var teachingWeekText;
        if (syllabusWeek == 11)
        {
            teachingWeekText = "Induction Week"
            teachingWeek = "";
        }
        else if (between(syllabusWeek, 12, 21))
        {
            teachingWeekText = "Teaching Week";
            teachingWeek = syllabusWeek - 11;
        }
        else if (between(syllabusWeek, 26, 34))
        {
            teachingWeekText = "Teaching Week";
            teachingWeek = syllabusWeek - 15;
        }
        else if (between(syllabusWeek, 40, 42))
        {
            teachingWeekText = "Teaching Week";
            teachingWeek = syllabusWeek - 20;
        }
        else if (between(syllabusWeek, 43, 45))
        {
            teachingWeekText = "Exam Period";
            teachingWeek = "";
        } else {
            teachingWeekText = "N/A (or vacation)";
            teachingWeek = "";
        }

        $('#week-teaching').text(teachingWeekText + " " + teachingWeek)
    }

    function between(a,from,to) {
        return a >= from && a <= to;
    }

    var date = moment(utc, "DDMMYYYY", true);
    var hash = location.hash.slice(1);
    if (hash.length > 0) {
        var date = moment(hash, "DDMMYYYY", true);
    }

    $('#datebtn').datepicker('update', date);
    $('#date').val(date.format("DD/MM/YYYY"));
    $('#date').trigger('keyup');
});
