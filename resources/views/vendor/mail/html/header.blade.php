@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Dikbud Sultra')
<img src="{{ asset('logo.png') }}" class="logo" alt="Dikbud Sultra">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
