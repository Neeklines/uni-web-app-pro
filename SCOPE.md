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

- [x] Moduł rejestracji, logowania użytkownika oraz w pełni działający system odzyskiwania hasła
- [ ] Główny pulpit (Dashboard) zawierający powitanie z imieniem użytkownika, łączne koszty w ujęciu miesięcznym i rocznym oraz interaktywny diagram kołowy z danymi w dwóch trybach.
- [ ] Pełne zarządzanie subskrypcjami: dodawanie (ręczne lub z katalogu), usuwanie, wygaszanie oraz zaawansowana edycja (m.in. przypinanie – pinned, oznaczanie jako ulubione, dodawanie notatek oraz edycja wprowadzonych danych).
- [ ] Widok listy subskrypcji wyposażony w mechanizmy filtrowania, sortowania oraz wyszukiwania konkretnych wydatków.
- [ ] Widok kalendarza pozwalający na śledzenie dat najbliższych płatności.
- [ ] System powiadomień o zbliżających się płatnościach: wizualne alerty wewnątrz aplikacji oraz powiadomienia wysyłane na adres e-mail użytkownika.
- [ ] Baza/katalog popularnych subskrypcji z predefiniowanymi logotypami oraz mechanizm kategoryzacji.
- [ ] Dedykowany panel ustawień konta i aplikacji oraz responsywny interfejs użytkownika (UI/UX) dostosowany do ekranów mobilnych i komputerowych.

## Zakres OUT:

* Rzeczywista integracja z API banków (Open Banking / PSD2) w celu automatycznego 
zaciągania historii konta
* Funkcja automatycznego anulowania subskrypcji z poziomu naszej aplikacji 
(wymagałoby to złożonych integracji z API usługodawców)
* Wysyłanie powiadomień Push/SMS bezpośrednio na fizyczny numer telefonu (zastępujemy to powiadomieniami w aplikacji i wiadomościami e-mail).
* Zaawansowane funkcje "Family Plan" – współdzielenie i dzielenie kosztów subskrypcji 
pomiędzy różnymi użytkownikami