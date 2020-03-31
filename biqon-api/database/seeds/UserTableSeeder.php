<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Role;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role_user = Role::where('name', 'user')->first();
        $role_admin = Role::where('name', 'admin')->first();
        $user = new User();
        $user->name = 'User';
        $user->email = 'user@user.com';
        $user->password = bcrypt('user');
        $user->save();
        $user->roles()->attach($role_user);
        $user = new User();
        $user->name = 'Marcos Torres';
        $user->email = 'marcostor13@gmail.com';
        $user->password = bcrypt('libido16');
        $user->save();
        $user->roles()->attach($role_admin);
     }
}
