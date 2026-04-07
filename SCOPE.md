## Cel projektu: 

Celem projektu jest zaprogramowanie i uruchomienie działającego prototypu aplikacji, w 
którym da się bezbłędnie przejść cały proces od założenia konta, przez dodanie swoich 
subskrypcji, aż po wygenerowanie raportu. Cel uznamy za spełniony, gdy użytkownik będzie 
mógł:
* zalogować się do systemu, 
* dodać minimum 3 różne stałe wydatki, 
* system poprawnie obliczy i wyświetli:
    + łączną kwotę miesięcznych zobowiązań
    + daty najbliższych płatności

## Zakres IN: 

- [x] Moduł rejestracji i logowania użytkownika (zapisywanie danych w bazie)
- [ ] Baza/katalog popularnych subskrypcji (np. Netflix, Spotify, Gym) z predefiniowanymi 
logotypami dla szybszego dodawania
- [ ] Formularz do ręcznego dodawania niestandardowych wydatków stałych (np. czynsz, 
bilet miesięczny, internet)
- [ ] Główny pulpit (Dashboard) prezentujący łączne koszty w ujęciu miesięcznym i rocznym
- [ ] Widok listy/kalendarza z posortowanymi datami najbliższych płatności
- [ ] Mechanizm kategoryzacji wydatków (np. Rozrywka, Zdrowie, Dom)
- [ ] Responsywny interfejs użytkownika (UI/UX) dostosowany do ekranów mobilnych i 
komputerowych

## Zakres OUT:

* Rzeczywista integracja z API banków (Open Banking / PSD2) w celu automatycznego 
zaciągania historii konta
* Funkcja automatycznego anulowania subskrypcji z poziomu naszej aplikacji 
(wymagałoby to złożonych integracji z API usługodawców)
* Wysyłanie powiadomień Push/SMS na fizyczny telefon (zastąpimy to wizualnymi 
alertami wewnątrz samej aplikacji)
* Opcja odzyskiwania zapomnianego hasła poprzez realną wysyłkę e-maili (zrobimy tylko 
widok atrapy)
* Zaawansowane funkcje "Family Plan" – współdzielenie i dzielenie kosztów subskrypcji 
pomiędzy różnymi użytkownikami