<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Client;
use App\Profile;
use App\Role;

class LandingController extends Controller
{

    //USERS
    public function getUsers(Request $request){
        return User::select('users.id','users.name', 'users.email', 'users.permits', 'roles.name as role', 'roles.id as role_id')
            ->selectRaw('GROUP_CONCAT(clients.bussinesname SEPARATOR ",") as clients')
            ->join('role_user', 'role_user.user_id', 'users.id')
            ->join('roles', 'roles.id', 'role_user.role_id')
            ->leftJoin('clients', 'clients.userid', 'users.id')
            ->groupBy ('users.id')
            ->get();
    }

    public function getUsersByID(Request $request){
        return User::select('users.id','users.name', 'users.email', 'users.permits', 'roles.name as role', 'roles.id as role_id')
            ->selectRaw('GROUP_CONCAT(clients.bussinesname SEPARATOR ",") as clients')
            ->join('role_user', 'role_user.user_id', 'users.id')
            ->join('roles', 'roles.id', 'role_user.role_id')
            ->leftJoin('clients', 'clients.userid', 'users.id')
            ->where('users.id', $request->userid)
            ->groupBy ('users.id')
            ->first();
    }

    public function getRoles(Request $request){
        return Role::get();
    }

    public function addUser(Request $request){

        $getUser = User::where('email', $request->email)->first();
            if(!$getUser){
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->permits = implode(',',$request->permits);
            $user->password = bcrypt($request->password);        
            $user->save();

            $user = User::select('users.id')->where('users.email', $request->email)->first();

            $profile = new Profile();
            $profile->user_id = $user->id;
            $profile->role_id = $request->role;   
            $profile->save();

            return ['status' => true, 'message' => 'Usuario creado']; 
        }else{
            return ['status' => false, 'message' => 'El usuario ya existe']; 
        } 

    } 

    public function editUser(Request $request){
        
        $update = [];
        if($request->name && $request->name != '') { $update['name'] =  $request->name; }
        if($request->email && $request->email != '') { $update['email'] =  $request->email; }
        if($request->password && $request->password != '') { $update['password'] =  bcrypt($request->password); }
        if($request->permits && $request->permits != '') { $update['permits'] =  implode(',',$request->permits); }
        if($request->role && $request->role !='') {
            Profile::where('user_id', $request->userid)->update(['role_id' => $request->role]);        
        }        
        User::where('id', $request->userid)->update($update);        
        return ['status' => true, 'message' => 'Usuario Editado'];
    }

    public function deleteUser(Request $request){
        Profile::where('user_id', $request->userid)->delete();        
        User::where('id', $request->userid)->delete();        
        return ['status' => true, 'message' => 'Usuario eliminado'];
    }
    
    

    //CLIENTS 


    public function addClient(Request $request){
        $client = new Client;        
        $client->userid = $request->userid;
        $client->legalname = ($request->legalname) ? $request->legalname: '';
        $client->bussinesname = ($request->bussinesname) ? $request->bussinesname: '';
        $client->rut = ($request->rut) ? $request->rut: '';
        $client->legalrepresentative = ($request->legalrepresentative) ? $request->legalrepresentative: '';
        $client->phone = ($request->phone) ? $request->phone: '';
        $client->address = ($request->address) ? $request->address: '';       
        $client->save(); 
        return ['status' => true, 'message' => 'Cliente creado']; 
    }  

    public function getClientsByID(Request $request){
        return Client::select('users.id','users.name as username', 'clients.*')
                ->join('users', 'users.id', 'clients.userid')
                ->where('clients.id', $request->clientid)
                ->first();
    }

    public function getClients(Request $request){
        return Client::select('users.id','users.name as username', 'clients.*')
                ->join('users', 'users.id', 'clients.userid')
                ->get();   
    } 
    
    public function editClient(Request $request){
        $update = [];
        if($request->userid) { $update['userid'] =  $request->userid; }
        if($request->name) { $update['name'] =  $request->name; }
        if($request->legalname) { $update['legalname'] =  $request->legalname; }
        if($request->bussinesname) { $update['bussinesname'] =  $request->bussinesname; }
        if($request->rut) { $update['rut'] =  $request->rut; }
        if($request->legalrepresentative) { $update['legalrepresentative'] =  $request->legalrepresentative; }
        if($request->phone) { $update['phone'] =  $request->phone; }
        if($request->address) { $update['address'] =  $request->address; }
        Client::where('id', $request->clientid)->update($update);        
        return ['status' => true, 'message' => 'Datos de cliente actualizados']; 
    }

    public function deteleClient(Request $request){
        Client::where('id', $request->clientid)->delete();        
        return ['status' => true, 'message' => 'Cliente eliminado'];
    }
}
