import { createStyles, Title, Text, Button, Container, Group, rem } from '@mantine/core';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
    root: {
        backgroundColor: theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background,
        height: "100vh",
        display: "flex",
        alignItems: "center"
    },

    label: {
        textAlign: 'center',
        fontWeight: 900,
        fontSize: rem(220),
        lineHeight: 1,
        marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
        color: theme.colors[theme.primaryColor][3],

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(120),
        },
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        textAlign: 'center',
        fontWeight: 900,
        fontSize: rem(38),
        color: theme.white,

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(32),
        },
    },

    description: {
        maxWidth: rem(540),
        margin: 'auto',
        marginTop: theme.spacing.xl,
        marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
        color: theme.colors[theme.primaryColor][1],
    },
}));

export default function ErrorPage() {
    const { classes } = useStyles();
    let router = useRouter();

    return (
        <div className={classes.root}>
            <Container>
                <div className={classes.label}>404</div>

                <Title className={classes.title}>Where are we...?</Title>

                <Text size="lg" align="center" className={classes.description}>
                    This page does not exist, as far as I know.
                </Text>

                <Group position="center">
                    <Button variant="white" size="md" onClick={() => router.replace("/")}>
                        Return to home
                    </Button>
                </Group>
            </Container>
        </div>
    );
}