// подключение пакетов
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer'); 
const rename = require('gulp-rename'); 
const minifycss = require('gulp-cssmin'); 
const tinypng = require('gulp-tinypng'); 
const spritesmith = require('gulp.spritesmith');
const merge = require('merge-stream');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
// const minifyjs = require('gulp-js-minify');

gulp.task('css', function() {
    return gulp.src('src/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['cover 99.5%', 'iOS 7']
        }))
        .pipe(gulp.dest('app/css/'));
});

gulp.task('cssmin', function() {
    return gulp.src([
        'app/css/**/*.css',
        '!app/css/style.min.css'
    ])
        .pipe(concat('styles.css'))
        .pipe(minifycss())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('app/css/'));
})

gulp.task('tinypng', function() {
    return gulp.src(['app/img/*.png', 'app/img/*.jpg'])
        .pipe(tinypng('eGwHsgRHgRYLa2syNI121TJRmNwb7J46'))
        .pipe(gulp.dest('app/img/'));
})

gulp.task('sprite', function() {
    let spriteData = gulp.src('src/sprite/*.png')
        .pipe(spritesmith({ // настройка спрайта
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            imgPath: '../img/sprite.png'
        }));

    let imgStream = spriteData.img
        .pipe(gulp.dest('app/img/'));

    let cssStream = spriteData.css
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css/'));
    return merge(imgStream, cssStream);
})

gulp.task('js', function() {
    return gulp.src('app/js/main/**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('scripts.js'))
        // .pipe(minifyjs())
        // .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest('app/js/'));
})

gulp.task('watch', ['css', 'cssmin', 'sprite'] ,function() {
    gulp.watch('src/css/**/*.css', ['css']);
    gulp.watch('app/css/style.css', ['cssmin']);
    gulp.watch('src/sprite/*.png', ['sprite']);
});
