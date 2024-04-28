import { makeStyles, tokens } from '@fluentui/react-components';
import AddPluginIcon from '../../../assets/plugin-icons/add-plugin.png';
import { PluginWizard } from '../plugin-wizard/PluginWizard';
import { BaseCard } from './BaseCard';

const useClasses = makeStyles({
    root: {
        marginBottom: tokens.spacingVerticalXXL,
    },
});

export const AddPluginCard: React.FC = () => {
    const classes = useClasses();

    return (
        <div className={classes.root}>
            <BaseCard
                image={AddPluginIcon}
                header="Plug-ins Personalizados"
                secondaryText="Desenvolvedor de IA"
                description="Adicione seu próprio plugin compatível com ChatGPT."
                action={<PluginWizard />}
                helpText="Quer aprender como criar um plugin personalizado?"
                helpLink="https://aka.ms/sk-plugins-howto"
            />
        </div>
    );
};
