<?php

namespace App\Http\Controllers;

use JWTAuth;
use App\User;
use App\Role;
use App\Profile;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Requests\RegistrationFormRequest;

class ApiController extends Controller
{
    /**
     * @var bool
     */
    public $loginAfterSignUp = true;

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $input = $request->only('email', 'password');
        $token = null;

        if (!$token = JWTAuth::attempt($input)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Email or Password',
            ], 401);
        }       

        $user = User::select('users.*', 'roles.name as role', 'roles.id as role_id')
            ->join('role_user', 'role_user.user_id', 'users.id')
            ->join('roles', 'roles.id', 'role_user.role_id')
            ->where('users.email', $request->email)
            ->where(function($query) {
                $query->where('users.permits', 'LIKE' ,'%rut%')
                      ->orWhere('roles.name', 'admin');
            })
            ->first();

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $user
        ]);
    }

    public function loginLanding(Request $request)
    {
        $input = $request->only('email', 'password');
        $token = null;

        if(!$token = JWTAuth::attempt($input)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid Email or Password',
            ], 401);
        }    

        $user = User::select('users.*', 'roles.name as role', 'roles.id as role_id')
            ->join('role_user', 'role_user.user_id', 'users.id')
            ->join('roles', 'roles.id', 'role_user.role_id')
            ->where('users.email', $request->email)
            ->where(function($query) {
                $query->where('users.permits', 'LIKE' ,'%landing%')
                      ->orWhere('roles.name', 'admin');
            })
            ->first();

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => $user
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function logout(Request $request)
    {
        $this->validate($request, [
            'token' => 'required'
        ]);

        try {
            JWTAuth::invalidate($request->token);

            return response()->json([
                'success' => true,
                'message' => 'User logged out successfully'
            ]);
        } catch (JWTException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, the user cannot be logged out'
            ], 500);
        }
    }

    /**
     * @param RegistrationFormRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        

        $getUser = User::where('email', $request->email)->first();

        if(!$getUser){
            $user = new User();
            $user->name = $request->name;
            $user->permits = $request->permits;
            $user->email = $request->email;
            $user->categoryid = $request->categoryid;
            $user->password = bcrypt($request->password);        
            $user->save();
          
               
            $user->roles()->attach(Role::where('id', $request->role_id)->first());

            $user = User::select('users.*', 'roles.name as role', 'roles.id as role_id')
            ->join('role_user', 'role_user.user_id', 'users.id')
            ->join('roles', 'roles.id', 'role_user.role_id')
            ->where('users.email', $request->email)
            ->first();

            $profile = new Profile();
            $profile->userid = $user->id;
            $profile->role_id = $user->role_id;   
            $profile->save();
   
            $input = $request->only('email', 'password');
            return response()->json([
                'success'   =>  true,
                'user'      =>  $user,
                'token'      => JWTAuth::attempt($input)
            ], 200);

        }else{
            return response()->json([
                'success'   =>  false,
                'message'      => 'El usuario ya existe'
            ], 200); 
        }
        
        
    }

    
}
