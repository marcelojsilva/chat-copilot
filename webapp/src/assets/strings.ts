export const COPY = {
    STEPWISE_RESULT_NOT_FOUND_REGEX: /(Resultado não encontrado, revise _stepsTaken para ver o que aconteceu\.)\s+(\[{.*}])/g,
    CHAT_DELETED_MESSAGE: (chatName?: string) =>
        `Chat ${
            chatName ? `{${chatName}} ` : ''
        }foi removido por outro usuário. Você ainda pode acessar o histórico de bate-papo mais recente por enquanto. Todo o conteúdo do bate-papo será apagado assim que você atualizar ou sair do aplicativo.`,
    REFRESH_APP_ADVISORY: 'Atualize a página para garantir que você tenha os dados mais recentes.',
};
