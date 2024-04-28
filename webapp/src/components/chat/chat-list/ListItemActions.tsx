import { Button } from '@fluentui/react-button';
import { makeStyles } from '@fluentui/react-components';
import { ErrorCircleRegular } from '@fluentui/react-icons';
import { Tooltip } from '@fluentui/react-tooltip';
import React, { useCallback, useState } from 'react';
import { COPY } from '../../../assets/strings';
import { useChat, useFile } from '../../../libs/hooks';
import { useAppSelector } from '../../../redux/app/hooks';
import { RootState } from '../../../redux/app/store';
import { FeatureKeys } from '../../../redux/features/app/AppState';
import { Breakpoints } from '../../../styles';
import { ArrowDownload16, Edit, Share20 } from '../../shared/BundledIcons';
import { InvitationCreateDialog } from '../invitation-dialog/InvitationCreateDialog';
import { DeleteChatDialog } from './dialogs/DeleteChatDialog';

const useClasses = makeStyles({
    root: {
        display: 'contents',
        ...Breakpoints.small({
            display: 'none',
        }),
    },
});

interface IListItemActionsProps {
    chatId: string;
    onEditTitleClick: () => void;
}

export const ListItemActions: React.FC<IListItemActionsProps> = ({ chatId, onEditTitleClick }) => {
    const classes = useClasses();
    const { features } = useAppSelector((state: RootState) => state.app);
    const { conversations } = useAppSelector((state: RootState) => state.conversations);

    const chat = useChat();
    const { downloadFile } = useFile();
    const [isGettingInvitationId, setIsGettingInvitationId] = useState(false);

    const onDownloadBotClick = useCallback(() => {
        // TODO: [Issue #47] Add a loading indicator
        void chat.downloadBot(chatId).then((content) => {
            downloadFile(
                `chat-history-${chatId}-${new Date().toISOString()}.json`,
                JSON.stringify(content),
                'text/json',
            );
        });
    }, [chat, chatId, downloadFile]);

    return (
        <div className={classes.root}>
            {conversations[chatId].disabled ? (
                <Tooltip content={COPY.CHAT_DELETED_MESSAGE()} relationship="label">
                    <Button
                        icon={<ErrorCircleRegular />}
                        appearance="transparent"
                        aria-label="Alerta: o Chat foi excluído por outro usuário."
                    />
                </Tooltip>
            ) : (
                <>
                    <Tooltip content={'Editar nome do Chat'} relationship="label">
                        <Button
                            icon={<Edit />}
                            appearance="transparent"
                            aria-label="Editar nome do Chat"
                            onClick={onEditTitleClick}
                            data-testid="editChatTitleButtonSimplified"
                        />
                    </Tooltip>
                    <Tooltip content={'Baixar sessão de Chat'} relationship="label">
                        <Button
                            disabled={!features[FeatureKeys.BotAsDocs].enabled}
                            icon={<ArrowDownload16 />}
                            appearance="transparent"
                            aria-label="Baixar sessão de Chat"
                            onClick={onDownloadBotClick}
                        />
                    </Tooltip>
                    <Tooltip content={'Compartilhe o código do chat ao vivo'} relationship="label">
                        <Button
                            disabled={!features[FeatureKeys.MultiUserChat].enabled}
                            icon={<Share20 />}
                            appearance="transparent"
                            aria-label="Compartilhe o código do chat ao vivo"
                            onClick={() => {
                                setIsGettingInvitationId(true);
                            }}
                        />
                    </Tooltip>
                    <DeleteChatDialog chatId={chatId} />
                    {isGettingInvitationId && (
                        <InvitationCreateDialog
                            onCancel={() => {
                                setIsGettingInvitationId(false);
                            }}
                            chatId={chatId}
                        />
                    )}
                </>
            )}
        </div>
    );
};
