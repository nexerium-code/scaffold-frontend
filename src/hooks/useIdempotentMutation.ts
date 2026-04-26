import { useRef } from "react";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useIdempotentMutation<TData = unknown, TError = Error, TVariables = void, TContext = unknown>(
    options: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, "mutationFn"> & {
        mutationFn: (variables: TVariables, idempotencyKey: string) => Promise<TData>;
    }
) {
    const { mutationFn, onSettled, ...restOptions } = options;
    const idempotencyKeyRef = useRef<string | undefined>(undefined);

    return useMutation<TData, TError, TVariables, TContext>({
        ...restOptions,
        mutationFn: (variables) => {
            const key = idempotencyKeyRef.current ?? crypto.randomUUID();
            idempotencyKeyRef.current = key;
            return mutationFn(variables, key);
        },
        onSettled: (data, error, variables, onMutateResult, context) => {
            idempotencyKeyRef.current = undefined;
            onSettled?.(data, error, variables, onMutateResult, context);
        }
    });
}

/**
 * useIdempotentMutation
 *
 * A wrapper around TanStack Query's `useMutation` that adds automatic
 * idempotency-key management to every mutation call.
 *
 * ## Problem it solves
 * Network retries, double-clicks, or React re-renders can cause the same
 * mutation to fire more than once.  If the server honours an idempotency key
 * (typically sent as a header), duplicate requests become no-ops and the
 * operation is applied exactly once.
 *
 * ## How it works
 * 1. A `useRef` holds the current idempotency key (initially `undefined`).
 * 2. When `mutationFn` is invoked:
 *    - If no key exists yet, a new UUID v4 is generated via `crypto.randomUUID()`.
 *    - The key is stored in the ref so that automatic retries of the *same*
 *      logical mutation reuse the same key.
 *    - The key is forwarded to the caller-provided `mutationFn` as the second
 *      argument so it can attach it to the outgoing request (e.g. as a header).
 * 3. When `onSettled` fires (success **or** error, after retries are exhausted):
 *    - The ref is reset to `undefined`, ensuring the *next* mutation call
 *      generates a fresh key.
 *    - The caller's own `onSettled` callback, if provided, is forwarded with
 *      all original arguments.
 *
 * ## API difference from plain `useMutation`
 * - `mutationFn` receives an extra second parameter: `idempotencyKey: string`.
 * - All other `UseMutationOptions` (onSuccess, onError, onSettled, retry, etc.)
 *   are passed through unchanged.
 */
