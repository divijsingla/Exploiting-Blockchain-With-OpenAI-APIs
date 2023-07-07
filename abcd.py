import networkx as nx;
import networkx as nx

def max_time(n, m, u, v, y):
    G = nx.Graph()
    for i in range(m):
        S_i = set(list(u[i])) | set(list(v[i]))
        for j in range(m):
            if i != j:
                if len(S_i & set(u[j])) == 2:
                    G.add_edge(i, j, weight=min(y[i], y[j]))
    T = nx.max_weight_spanning_tree(G)
    return sum(T.edges(data=True)["weight"])

if __name__ == "__main__":
    n = 3
    m = 2
    u = [1, 2]
    v = [2, 3]
    y = [2, 3]
    T = max_time(n, m, u, v, y)
    print(T)
