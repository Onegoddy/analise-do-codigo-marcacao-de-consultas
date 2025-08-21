// ====== IMPORTS DE DEPENDÊNCIAS E TIPOS ======

import React from 'react'; // Biblioteca base para criação de componentes React.
import styled from 'styled-components/native'; // Permite criar componentes visuais estilizados com tema.
import { Modal, ViewStyle } from 'react-native'; // Modal nativo e tipagem de estilo de view.
import { Button, Input } from 'react-native-elements'; // Componentes prontos para botões e campos de entrada.
import theme from '../styles/theme'; // Objeto com cores, espaçamento e tipografia padronizada do app.

// ====== TIPAGEM DAS PROPRIEDADES DO MODAL ======
// Define os dados recebidos do componente pai (ex.: visibilidade, ações e detalhes da consulta).

interface AppointmentActionModalProps {
  visible: boolean; // Controla se o modal está aberto ou fechado.
  onClose: () => void; // Função chamada ao fechar o modal.
  onConfirm: (reason?: string) => void; // Função para confirmar/cancelar consulta, com motivo opcional.
  actionType: 'confirm' | 'cancel'; // Define se o modal é de confirmação ou cancelamento.
  appointmentDetails: { // Dados principais da consulta a serem exibidos no modal.
    patientName: string; // Nome do paciente.
    doctorName: string; // Nome do médico.
    date: string; // Data da consulta.
    time: string; // Horário da consulta.
    specialty: string; // Especialidade médica.
};

}
// ====== COMPONENTE PRINCIPAL DO MODAL ======

const AppointmentActionModal: React.FC<AppointmentActionModalProps> = ({
  visible,
  onClose,
  onConfirm,
  actionType,
  appointmentDetails,
}) => {
  const [reason, setReason] = React.useState('');// Armazena o motivo do cancelamento (se houver).

  const handleConfirm = () => {// Função executada ao confirmar: envia o motivo (se digitado), reseta o estado e fecha o modal.
    onConfirm(reason.trim() || undefined);
    setReason('');
    onClose();
  };

  const handleClose = () => {// Função para fechar o modal sem confirmar e limpar o campo de motivo.
    setReason('');
    onClose();
  };

  const isCancel = actionType === 'cancel';// Verifica se a ação atual é de cancelamento.

  // ====== ESTRUTURA VISUAL DO MODAL ======
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Overlay>{/* Fundo semitransparente que cobre a tela */}
        <ModalContainer>{/* Container branco centralizado com o conteúdo do modal */}
          <Header>
            <Title> {/* Título do modal varia entre Cancelar ou Confirmar */}
              {isCancel ? 'Cancelar Consulta' : 'Confirmar Consulta'}
            </Title>
          </Header>

          <Content>
            <AppointmentInfo>
              <InfoRow>
                <InfoLabel>Paciente:</InfoLabel>
                <InfoValue>{appointmentDetails.patientName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Médico:</InfoLabel>
                <InfoValue>{appointmentDetails.doctorName}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Especialidade:</InfoLabel>
                <InfoValue>{appointmentDetails.specialty}</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Data/Hora:</InfoLabel>
                <InfoValue>{appointmentDetails.date} às {appointmentDetails.time}</InfoValue>
              </InfoRow>
            </AppointmentInfo>

            {isCancel && (
              <ReasonContainer>
                <Input
                  label="Motivo do cancelamento (opcional)"
                  placeholder="Digite o motivo..."
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={3}
                  containerStyle={styles.reasonInput}
                />{/* Campo de texto opcional para informar motivo do cancelamento */}
              </ReasonContainer>
            )}

            <ConfirmationText isCancel={isCancel}>
              {isCancel 
                ? 'Tem certeza que deseja cancelar esta consulta?'
                : 'Tem certeza que deseja confirmar esta consulta?'
              }
            </ConfirmationText>{/* Texto de confirmação exibido antes de executar a ação */}
          </Content>
            
            {/* Botões de Cancelar e Confirmar ação */}
          <ButtonContainer>
            <Button
              title="Cancelar"
              onPress={handleClose}
              containerStyle={styles.cancelButton as ViewStyle}
              buttonStyle={styles.cancelButtonStyle}
            />
            <Button
              title={isCancel ? 'Confirmar Cancelamento' : 'Confirmar'}
              onPress={handleConfirm}
              containerStyle={styles.confirmButton as ViewStyle}
              buttonStyle={[
                styles.confirmButtonStyle,
                { backgroundColor: isCancel ? theme.colors.error : theme.colors.success }
              ]}
            />
          </ButtonContainer>
        </ModalContainer>
      </Overlay>
    </Modal>
  );
};

// ====== ESTILOS AUXILIARES (fora do styled-components) ======

const styles = {
  reasonInput: {
    marginBottom: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
  cancelButtonStyle: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  confirmButtonStyle: {
    paddingVertical: 12,
  },
};
// Fundo escurecido que cobre a tela e centraliza o modal

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;
// Caixa branca principal do modal com sombra e bordas arredondadas

const ModalContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;
// Cabeçalho do modal com título e borda inferior

const Header = styled.View`
  padding: 20px 20px 10px 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;
// Texto do título (Cancelar Consulta / Confirmar Consulta)

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  text-align: center;
`;
// Área central do modal (informações e inputs)

const Content = styled.View`
  padding: 20px;
`;
// Caixa que agrupa informações da consulta (paciente, médico, data, etc.)

const AppointmentInfo = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;
// Linha com rótulo e valor (par chave: Paciente, Médico, etc.)

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;
// Texto do rótulo (ex.: "Paciente:", "Médico:")

const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 500;
`;
// Valor correspondente ao rótulo (nome do paciente, médico, etc.)

const InfoValue = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 400;
  flex: 1;
  text-align: right;
`;
// Container do campo de motivo do cancelamento

const ReasonContainer = styled.View`
  margin-bottom: 16px;
`;
// Mensagem de confirmação (texto em verde ou vermelho, dependendo da ação)

const ConfirmationText = styled.Text<{ isCancel: boolean }>`
  font-size: 16px;
  color: ${(props: { isCancel: boolean }) => props.isCancel ? theme.colors.error : theme.colors.success};
  text-align: center;
  margin-bottom: 20px;
  font-weight: 500;
`;
// Container dos botões inferiores (Cancelar / Confirmar)

const ButtonContainer = styled.View`
  flex-direction: row;
  padding: 0 20px 20px 20px;
`;

export default AppointmentActionModal;// Exporta o componente para ser usado em outras telas

