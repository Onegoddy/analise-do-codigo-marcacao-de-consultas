# README — Refatoração das telas (etapa atual)

## Sobre o Projeto

Este é um aplicativo mobile desenvolvido em React Native para agendamento de consultas médicas. O sistema permite que pacientes visualizem médicos disponíveis, agendem consultas e gerenciem seus compromissos médicos de forma simples e intuitiva.

## 🎯 Objetivos da etapa

- **Organizar o código** em pastas por feature/tela, melhorando legibilidade e manutenção.  
- **Separar responsabilidades**:  
  - `index.tsx` (apresentação/composição)  
  - `hooks/*` (estado, efeitos, handlers)  
  - `services/*` (persistência e I/O)  
  - `models/*` (tipos e validações)  
  - `components/*` (UI atômica/reutilizável)  
  - `styles.ts` (styled-components centralizados)
- **Preservar comportamento** (navegação, validações, AsyncStorage, notificações, toasts/alerts).

---

## ✅ Telas refatoradas nesta etapa

### 1) CreateAppointmentScreen ➜ `src/screens/CreateAppointment/`

**Antes:** uma única tela contendo UI, estado, validação, persistência e dados mock de médicos.  
**Depois:** módulos separados mantendo o mesmo fluxo de criação.

```
CreateAppointment/
  index.tsx                     # UI + composição da tela
  styles.ts                     # styled-components
  hooks/
    useCreateAppointment.ts     # estado/validação/ação de salvar
  services/
    appointmentService.ts       # persistência (AsyncStorage @MedicalApp:appointments)
  models/
    appointment.ts              # tipos + validateAppointment
    doctors.ts                  # tipos + mock de médicos disponíveis
  components/
    DateField.tsx               # input de data (wrap de Input)
    ErrorMessage.tsx            # exibição de erro padronizada
```

**Principais mudanças (sem alterar lógica):**
- `appointmentService` isola `getAll/setAll` do **AsyncStorage**.  
- `validateAppointment` centraliza a mensagem: _“Por favor, preencha a data…”_.  
- Lista de médicos migrou para `models/doctors.ts`.  
- Alert, notificação ao médico (`notificationService.notifyNewAppointment`) e `navigation.goBack()` preservados.

---

### 2) ProfileScreen ➜ `src/screens/Profile/`

**Antes:** tela única com UI, badge de papel e helpers.  
**Depois:** UI limpa e componentes reutilizáveis.

```
Profile/
  index.tsx               # composição (Header, ProfileCard, botões)
  styles.ts               # styled-components
  hooks/
    useProfile.ts         # integra com useAuth, expõe user/signOut
  models/
    user.ts               # tipos e getRoleText()
  components/
    ProfileCard.tsx       # Avatar, nome, email, badge, especialidade
    RoleBadge.tsx         # badge colorida por papel
```

**Principais mudanças (sem alterar lógica):**
- Mapeamento de papel (`admin/doctor/patient`) extraído para `models/user.ts`.  
- `RoleBadge` encapsula estilo e rótulo do papel.  
- Navegação (“Editar Perfil”, “Voltar”) e `signOut` mantidos.

---

### 3) EditProfileScreen ➜ `src/screens/EditProfile/`

**Antes:** tela única contendo UI, validações e persistência.  
**Depois:** responsabilidades separadas, mantendo o fluxo de edição.

```
EditProfile/
  index.tsx               # UI da tela
  styles.ts               # styled-components
  hooks/
    useEditProfile.ts     # estado, validação, salvar, alerts
  services/
    profileStorage.ts     # AsyncStorage (@MedicalApp:user)
  components/
    RoleBadge.tsx         # badge de papel (admin/doctor/patient)
```

**Principais mudanças (sem alterar lógica):**
- Validação simples (nome e e-mail obrigatórios) permanece.  
- Atualização no contexto (`updateUser`) e persistência em `@MedicalApp:user` via `profileStorage`.  
- `Alert` de sucesso com retorno à tela anterior preservado.

---

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Onegoddy/analise-do-codigo-marcacao-de-consultas
cd marcacaoDeConsultasMedicas
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Instale as dependências do iOS (apenas em macOS):
```bash
cd ios
pod install
cd ..
```

4. Inicie o aplicativo:
```bash
# Método recomendado (Expo)
npm start
# ou
yarn start

# Para Android
npm run android
# ou
yarn android

# Para iOS (apenas em macOS)
npm run ios
# ou
yarn ios

# Para Web (desenvolvimento)
npm run web
# ou
yarn web
```

## Autores

- **Professor Hete Caetano** - [hete.caetano@fiap.com.br](mailto:hete.caetano@fiap.com.br)

## 👥 Integrantes

- André soler - RM98827
- Gustavo Henrique Santos Bonfim - RM98864
- João Pedro Marques Rodrigues – RM98307  
- Kayky Paschoal Ribeiro – RM99929  
- Natan Eguchi dos Santos – RM98720