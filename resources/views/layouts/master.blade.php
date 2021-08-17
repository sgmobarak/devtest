<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{config('app.name')}} - @yield('title')</title>

    <link rel="icon" type="image/png" href="{{asset('asset/favicon.png')}}" sizes="32x32" />

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="{{mix('css/devapp.css')}}">

    @yield('css')

    <script>
        window.csrfToken = '{{csrf_token()}}';
        window.baseUrl = '{{url("/")}}';
    </script>

</head>

<body>

    <div class="header">
        <div class="header__wrapper">
            <h5 class="header__logo">
                DEV TEST
            </h5>

            <div class="header__nav">
                @if(auth()->check())
                <span class="header__nav__item">
                    Hello {{auth()->user()->name}},
                </span>
                <form class="header__nav__item" method="POST" action="{{ route('logout') }}">
                    @csrf
                    <a href="route('logout')" onclick="event.preventDefault();
                                        this.closest('form').submit();">
                        {{ __('Log Out') }}
                    </a>
                </form>
                @endif

                <a class="header__nav__item" href="{{route('download.dbdump')}}">
                    Download DB
                </a>
            </div>

        </div>
    </div>

    @yield('content')

    <script src="{{mix('js/devapp.js')}}"></script>

    @yield('scripts')

</body>

</html>