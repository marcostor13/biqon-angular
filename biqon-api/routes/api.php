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
Route::post('login-landing', 'ApiController@loginLanding');
Route::post('register', 'ApiController@register');



Route::group(['middleware' => ['jwt.auth'] ], function () {
    Route::post('logout', 'ApiController@logout');
    Route::post('getDataDashboard', 'DashboardController@getDataDashboard');
    Route::post('upload-data', 'DashboardController@uploadData');
    Route::post('getUsers', 'LandingController@getUsers');
    Route::post('addClient', 'LandingController@addClient');
    Route::post('getClients', 'LandingController@getClients');
    Route::post('editClient', 'LandingController@editClient');
    Route::post('deteleClient', 'LandingController@deteleClient');   
    Route::post('getRoles', 'LandingController@getRoles');   
    Route::post('addUser', 'LandingController@addUser');  
    Route::post('getUsersByID', 'LandingController@getUsersByID');  
    Route::post('getClientsByID', 'LandingController@getClientsByID');  
    Route::post('editUser', 'LandingController@editUser');  
    Route::post('deleteUser', 'LandingController@deleteUser');  
    
    


    
    
    
});