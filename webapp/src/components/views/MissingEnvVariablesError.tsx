// Copyright (c) Microsoft. All rights reserved.

import { Body1, Subtitle1, Title3 } from '@fluentui/react-components';
import { FC } from 'react';
import { useClasses } from '../../App';

interface IData {
    missingVariables: string[];
}

const MissingEnvVariablesError: FC<IData> = ({ missingVariables }) => {
    const classes = useClasses();

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Subtitle1 as="h1">Chat AI</Subtitle1>
            </div>
            <div style={{ padding: 80, gap: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Title3>
                    {
                        'Certifique-se de que seu arquivo ".env" esteja configurado corretamente com todas as variáveis ​​de ambiente definidas em ".env.example" e reinicie o aplicativo.'
                    }
                </Title3>
                <Body1>Estão faltando as seguintes variáveis: {missingVariables.join(', ')}</Body1>
            </div>
        </div>
    );
};

export default MissingEnvVariablesError;
