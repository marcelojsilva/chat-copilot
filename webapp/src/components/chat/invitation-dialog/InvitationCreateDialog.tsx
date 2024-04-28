// Copyright (c) Microsoft. All rights reserved.

import {
    Button,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    Label,
    makeStyles,
    tokens,
} from '@fluentui/react-components';
import { Checkmark20Filled } from '@fluentui/react-icons';
import React, { useCallback, useEffect } from 'react';

const useStyles = makeStyles({
    content: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: tokens.spacingVerticalMNudge,
    },
});

interface InvitationCreateDialogProps {
    onCancel: () => void;
    chatId: string;
}

export const InvitationCreateDialog: React.FC<InvitationCreateDialogProps> = ({ onCancel, chatId }) => {
    const [isIdCopied, setIsIdCopied] = React.useState<boolean>(false);

    const classes = useStyles();

    const copyId = useCallback(() => {
        void navigator.clipboard.writeText(chatId).then(() => {
            setIsIdCopied(true);
        });
    }, [chatId]);

    // Copy the chatId to clipboard by default when component mounts.
    useEffect(() => {
        copyId();
    }, [copyId]);

    return (
        <div>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Convide outras pessoas para o seu Bot</DialogTitle>
                    <DialogContent className={classes.content}>
                        <Label>
                            Forneça o seguinte ID de bate-papo aos seus amigos para que eles possam participar do chat.
                        </Label>
                        <Label data-testid="invitationDialogChatIDLabel" weight="semibold">
                            {chatId}
                        </Label>
                    </DialogContent>
                    <DialogActions>
                        <Button data-testid="invitationDialogCloseButton" appearance="secondary" onClick={onCancel}>
                            Fechar
                        </Button>
                        <Button
                            data-testid="invitationDialogChatIDCopyButton"
                            appearance="primary"
                            onClick={copyId}
                            icon={isIdCopied ? <Checkmark20Filled /> : null}
                        >
                            {isIdCopied ? 'Copiado' : 'Copiar'}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </div>
    );
};
