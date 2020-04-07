<?php

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

Route::post('login', 'ApiController@login');
Route::post('register', 'ApiController@register');



Route::group(['middleware' => ['jwt.auth'] ], function () {
    Route::post('logout', 'ApiController@logout');
    Route::post('getDataDashboard', 'DashboardController@getDataDashboard');
    Route::post('upload-data', 'DashboardController@uploadData');
    
    
});