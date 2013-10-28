$(function() {

    $('#datebtn').datepicker({
        format: "dd/mm/yyyy",
        calendarWeeks: true,
        keyboardNavigation: false,
        todayHighlight: true
    })
        .on('changeDate', function(e) {

            console.log(e.date);

            //var formdate = moment.utc($(this).val() + " 13:00", "DD/MM/YYYY hh:mm", true);
            var formdate = moment.utc(e.date);
            $('#date').val(formdate.format("DD/MM/YYYY"))
            $('#date').trigger('keyup');
        });

    $('#date').on('keyup', function() {
        var formdate = moment.utc( $(this).val(), "DD/MM/YYYY", true );

        if (!formdate.isValid() || formdate.year() < 2013 || formdate.year() > 2014) {
            $(this).parent().addClass('has-error');
        } else {
            $(this).parent().removeClass('has-error');
            location.hash = '#' + formdate.format("DDMMYYYY");
        }
        $('#datebtn').datepicker('hide');
        update(formdate);
    });

    var local = moment();
    var utc = moment.utc();

    $('#local-now').text( local.format("dddd, D MMMM YYYY, h:mm a (Z)") );
    $('#utc-now').text( utc.format("dddd, D MMMM YYYY, h:mm a (Z)") );

    function update(ts) {

        if (!ts.isValid() || ts.year() < 2013 || ts.year() > 2014) {
            $('.week-field').text("");
            return;
        }

        //Prepend year as a hack to make gregorian week number grow across new year
        var yearPrefix = "" + ts.format("YY");
        var gregWeek = parseInt(yearPrefix + ts.format("ww"));
        $('#week-gregorian').text( ts.format("ww") );

        //Syllabus 2013/14 starts on Mon 29 Jul (week 31)
        var syllabusWeek = parseInt(("" + (gregWeek - 30)).substring(2));

        if (gregWeek < 1331 || gregWeek > 1430) {
            $('#week-syllabus').text( "Not in 2013-14");
        } else {
            $('#week-syllabus').text( syllabusWeek );
        }

        //Durham weeks
        var durhamWeek;
        var durhamWeekText;
        if (between(syllabusWeek, 10, 20))
        {
            durhamWeekText = "Michaelmas Week";
            durhamWeek = syllabusWeek - 9;
        }
        else if (between(syllabusWeek, 26, 34))
        {
            durhamWeekText = "Epiphany Week";
            durhamWeek = syllabusWeek - 25;
        }
        else if (between(syllabusWeek, 40, 45))
        {
            durhamWeekText = "Easter Week";
            durhamWeek = syllabusWeek - 39;
        } else {
            durhamWeekText = "N/A (or vacation)";
            durhamWeek = "";
        }
        $('#week-durham').text(durhamWeekText + " " + durhamWeek)

        //Teaching Weeks
        var teachingWeek;
        var teachingWeekText;
        if (syllabusWeek == 10)
        {
            teachingWeekText = "Induction Week"
            teachingWeek = "";
        }
        else if (between(syllabusWeek, 11, 20))
        {
            teachingWeekText = "Teaching Week";
            teachingWeek = syllabusWeek - 10;
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
