<?php

use App\Http\Controllers\ApiCardController;
use App\Http\Controllers\ApiSectionController;
use App\Http\Controllers\ApiUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('users', ApiUserController::class);

    Route::apiResource('sections', ApiSectionController::class);

    // use of nested controller
    Route::apiResource('cards', ApiCardController::class);
});
