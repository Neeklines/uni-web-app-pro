# CONTRIBUTING

Ten dokument opisuje zasady pracy nad projektem oraz workflow używany w repozytorium.

Jeżeli dopiero zaczynasz pracę z GitHubem lub narzędziami developerskimi – przeczytaj cały dokument.

Projekt wykorzystuje:
- Git oraz GitHub do zarządzania kodem
- Pull Requests do wprowadzania zmian
- testy automatyczne
- linting kodu

Celem tych zasad jest:
- uniknięcie konfliktów w kodzie
- utrzymanie czytelnej historii projektu
- zapewnienie działającego kodu w głównej gałęzi repozytorium

---

# TL;DR

Najważniejsze zasady:

1. Nie wolno pushować bezpośrednio do `main`
2. Każda zmiana musi mieć Pull Request
3. Każdy Pull Request musi zostać zatwierdzony przez inną osobę
4. Testy muszą przejść przed merge
5. Nie pracujemy na czyjejś gałęzi bez wcześniejszej zgody
6. Każda większa zmiana powinna mieć Issue
7. Kod i komentarze w kodzie piszemy po **angielsku**

---

# 1. Zasady pracy z repozytorium

Główna gałąź repozytorium to: `main`


Ta gałąź jest **chroniona (protected branch)**.

Oznacza to że:

- nie można pushować kodu bezpośrednio do `main`
- wszystkie zmiany muszą przejść przez Pull Request

---

# 2. Reguły na gałęzi main

W repozytorium włączone są następujące reguły ochrony gałęzi.

## Require a pull request before merging

Wszystkie zmiany muszą być wprowadzane poprzez Pull Request.

Nie wolno robić: `git push origin main`

Każda zmiana musi być wykonana w osobnej gałęzi i dopiero potem zmergowana.

---

## Require approvals (1)

Każdy Pull Request musi zostać zatwierdzony przez **co najmniej jedną inną osobę**.

Autor PR nie powinien zatwierdzać własnych zmian.

---

## Dismiss stale pull request approvals when new commits are pushed

Jeżeli po review zostanie dodany nowy commit do PR:

- wcześniejsze approve zostaje anulowane
- PR musi zostać ponownie sprawdzony

Dzięki temu reviewer zawsze zatwierdza **najbardziej aktualny kod**.

---

## Require review from Code Owners (opcjonalne)

Niektóre pliki mogą mieć przypisanego właściciela (`CODEOWNERS`).

W takim przypadku Pull Request wymaga zatwierdzenia od odpowiedniej osoby.

---

## Require approval of the most recent reviewable push

Ostatni commit w Pull Request musi zostać zatwierdzony przez **inną osobę niż autor**.

---

## Require status checks to pass before merging

Pull Request może zostać zmergowany tylko jeżeli przejdą wszystkie testy automatyczne.

Testy są uruchamiane przez GitHub Actions.

---

## Require branches to be up to date before merging

Pull Request musi być oparty na **najbardziej aktualnej wersji gałęzi main**.

Jeżeli ktoś wcześniej zmerguje zmiany do `main`, trzeba zaktualizować swoją gałąź.

---

## Require conversation resolution before merging

Jeżeli w PR pojawią się komentarze lub dyskusje dotyczące kodu:

- muszą zostać rozwiązane przed merge.

---

# 3. Gałęzie (branches)

Każda zmiana powinna być wykonywana w osobnej gałęzi.

Schemat nazewnictwa:
```
feature/nazwa-funkcji
fix/nazwa-problemu
chore/nazwa-zmiany
```