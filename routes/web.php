<?php

use App\Http\Controllers\DownloadController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    //return view('welcome');

    return redirect()->route('login');
});

/*
Route::get('/dashboard', function () {
    return view('dashboard');
})
->middleware(['auth'])->name('dashboard');
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [HomeController::class, 'index'])
        ->name('dashboard');

    Route::get('/download/dbdump', [DownloadController::class, 'getSqlDump'])
        ->name('download.dbdump');
});


require __DIR__ . '/auth.php';
